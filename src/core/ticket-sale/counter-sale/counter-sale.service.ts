import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { PassengerType, PaymentMethod, PaymentStatus } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { TicketSaleRepository } from '../ticket-sale.repository'
import { CreateCounterSaleDto } from './dto/req/create-counter-sale.dto'
import { SaleResponseDto } from '../dto/res/sales-response.dto'

@Injectable()
export class CounterSalesService {
  constructor(private readonly ticketSaleRepository: TicketSaleRepository) {}

  async processCounterSale(
    createSaleDto: CreateCounterSaleDto,
  ): Promise<SaleResponseDto> {
    await this.validateSaleData(createSaleDto)

    const seatIds = createSaleDto.passengers.map((p) => p.physicalSeatId)
    const occupiedSeats = await this.ticketSaleRepository.checkSeatAvailability(
      createSaleDto.routeSheetId,
      seatIds,
      createSaleDto.originId,
      createSaleDto.destinationId,
    )

    if (occupiedSeats.length > 0) {
      throw new ConflictException(
        `Los siguientes asientos no están disponibles: ${occupiedSeats.join(', ')}`,
      )
    }

    const ticketsData = await this.prepareTicketsData(createSaleDto)
    const totals = this.calculateTotals(ticketsData)

    const paymentData = {
      amount: totals.amount,
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      discounts: totals.discounts,
      paymentMethod: createSaleDto.paymentMethod,
      status: PaymentStatus.APPROVED,
      bankReference: createSaleDto.bankReference,
      isOnlinePayment: false,
      user: { connect: { id: createSaleDto.clerkId } },
      company: { connect: { id: createSaleDto.companyId } },
    }

    const result = await this.ticketSaleRepository.createPaymentWithTickets(
      paymentData,
      ticketsData,
    )

    return {
      payment: {
        id: result.payment.id,
        amount: result.payment.amount,
        subtotal: result.payment.subtotal,
        taxes: result.payment.taxes || 0,
        discounts: result.payment.discounts || 0,
        paymentMethod: result.payment.paymentMethod,
        status: result.payment.status,
        receiptUrl: result.payment.receiptUrl ?? undefined,
        isOnlinePayment: result.payment.isOnlinePayment,
        createdAt: result.payment.createdAt,
        tickets: result.payment.tickets.map((ticket) => ({
          id: ticket.id,
          passengerId: ticket.passengerId,
          passengerName: ticket.passengerName,
          passengerType: ticket.passengerType,
          price: ticket.price,
          basePrice: ticket.basePrice,
          discount: ticket.discount,
          accessCode: ticket.accessCode,
          status: ticket.status,
          receiptUrl: ticket.receiptUrl ?? undefined,
          createdAt: ticket.createdAt,
          origin: {
            id: ticket.origin.id,
            name: ticket.origin.name,
            province: ticket.origin.province,
          },
          destination: {
            id: ticket.destination.id,
            name: ticket.destination.name,
            province: ticket.destination.province,
          },
          physicalSeat: {
            id: ticket.physicalSeat.id,
            seatNumber: ticket.physicalSeat.seatNumber,
            seatType: {
              name: ticket.physicalSeat.seatType.name,
              description: ticket.physicalSeat.seatType.description || '',
            },
          },
        })),
      },
      message: 'Venta procesada exitosamente en ventanilla',
      totalTickets: ticketsData.length,
    }
  }

  private async validateSaleData(
    createSaleDto: CreateCounterSaleDto,
  ): Promise<void> {
    const routeSheet = await this.ticketSaleRepository.findRouteSheetById(
      createSaleDto.routeSheetId,
    )
    if (!routeSheet) {
      throw new NotFoundException('Hoja de ruta no encontrada')
    }

    if (routeSheet.status !== 'GENERATED') {
      throw new BadRequestException(
        'La hoja de ruta no está disponible para ventas',
      )
    }

    const clerk = await this.ticketSaleRepository.findUserById(
      createSaleDto.clerkId,
    )
    if (!clerk || clerk.role !== 'CLERK') {
      throw new NotFoundException('Oficinista no encontrado o no válido')
    }

    const company = await this.ticketSaleRepository.findCompanyById(
      createSaleDto.companyId,
    )
    if (!company || !company.isActive) {
      throw new NotFoundException('Cooperativa no encontrada o inactiva')
    }

    const origin = await this.ticketSaleRepository.findCityById(
      createSaleDto.originId,
    )
    const destination = await this.ticketSaleRepository.findCityById(
      createSaleDto.destinationId,
    )

    if (!origin || !destination) {
      throw new NotFoundException('Ciudad de origen o destino no encontrada')
    }

    if (createSaleDto.originId === createSaleDto.destinationId) {
      throw new BadRequestException(
        'La ciudad de origen no puede ser igual a la de destino',
      )
    }

    for (const passenger of createSaleDto.passengers) {
      const seat = await this.ticketSaleRepository.findPhysicalSeatById(
        passenger.physicalSeatId,
      )
      if (!seat) {
        throw new NotFoundException(
          `Asiento con ID ${passenger.physicalSeatId} no encontrado`,
        )
      }
      if (seat.busId !== routeSheet.busId) {
        throw new BadRequestException(
          `El asiento ${seat.seatNumber} no pertenece al bus de esta ruta`,
        )
      }
    }
  }

  private async prepareTicketsData(createSaleDto: CreateCounterSaleDto) {
    const ticketsData: Array<{
      passengerId: string
      passengerName: string
      passengerType: PassengerType
      price: number
      basePrice: number
      discount: number
      accessCode: string
      status: string
      paymentMethod: PaymentMethod
      routeSheetId: number
      physicalSeatId: number
      originId: number
      destinationId: number
    }> = []

    for (const passenger of createSaleDto.passengers) {
      const seat = await this.ticketSaleRepository.findPhysicalSeatById(
        passenger.physicalSeatId,
      )

      if (!seat) {
        throw new NotFoundException(
          `Asiento con ID ${passenger.physicalSeatId} no encontrado`,
        )
      }

      const basePrice =
        await this.ticketSaleRepository.calculateBasePriceBetweenCities(
          createSaleDto.routeSheetId,
          createSaleDto.originId,
          createSaleDto.destinationId,
          seat.seatTypeId,
        )

      const discount = this.calculateDiscount(
        basePrice,
        passenger.passengerType,
      )
      const finalPrice = basePrice - discount

      ticketsData.push({
        passengerId: passenger.passengerId,
        passengerName: passenger.passengerName,
        passengerType: passenger.passengerType,
        price: finalPrice,
        basePrice,
        discount,
        accessCode: this.generateAccessCode(),
        status: 'ACTIVE',
        paymentMethod: createSaleDto.paymentMethod,
        routeSheetId: createSaleDto.routeSheetId,
        physicalSeatId: passenger.physicalSeatId,
        originId: createSaleDto.originId,
        destinationId: createSaleDto.destinationId,
      })
    }

    return ticketsData
  }

  private calculateDiscount(
    basePrice: number,
    passengerType: PassengerType,
  ): number {
    switch (passengerType) {
      case PassengerType.SENIOR:
        return basePrice * 0.5 // 50% descuento tercera edad
      case PassengerType.DISABLED:
        return basePrice * 0.5 // 50% descuento discapacitados
      case PassengerType.MINOR:
        return basePrice * 0.25 // 25% descuento menores
      case PassengerType.NORMAL:
      default:
        return 0
    }
  }

  private calculateTotals(
    ticketsData: Array<{
      basePrice: number
      discount: number
    }>,
  ) {
    const subtotal = ticketsData.reduce(
      (sum, ticket) => sum + ticket.basePrice,
      0,
    )
    const discounts = ticketsData.reduce(
      (sum, ticket) => sum + ticket.discount,
      0,
    )
    const taxes = (subtotal - discounts) * 0.15 // 15% IVA
    const amount = subtotal - discounts + taxes

    return {
      subtotal,
      discounts,
      taxes,
      amount,
    }
  }

  private generateAccessCode(): string {
    return uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()
  }

  async validatePayment(paymentId: number, clerkId: number): Promise<void> {
    const payment = await this.ticketSaleRepository.findPaymentById(paymentId)

    if (!payment) {
      throw new NotFoundException('Pago no encontrado')
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('El pago no está pendiente de validación')
    }

    await this.ticketSaleRepository.updatePaymentStatus(
      paymentId,
      PaymentStatus.APPROVED,
      clerkId,
    )
  }

  async rejectPayment(paymentId: number, clerkId: number): Promise<void> {
    const payment = await this.ticketSaleRepository.findPaymentById(paymentId)

    if (!payment) {
      throw new NotFoundException('Pago no encontrado')
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('El pago no está pendiente de validación')
    }

    await this.ticketSaleRepository.updatePaymentStatus(
      paymentId,
      PaymentStatus.REJECTED,
      clerkId,
    )
  }
}
