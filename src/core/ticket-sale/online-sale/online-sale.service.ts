import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { PassengerType, PaymentMethod, PaymentStatus } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { TicketSaleRepository } from '../ticket-sale.repository'
import { CreateOnlineSaleDto } from './dto/req/create-online-sale.dto'
import { SaleResponseDto } from '../dto/res/sales-response.dto'

@Injectable()
export class OnlineSalesService {
  constructor(private readonly ticketSaleRepository: TicketSaleRepository) {}

  async processOnlineSale(
    createSaleDto: CreateOnlineSaleDto,
  ): Promise<SaleResponseDto> {
    await this.validateSaleData(createSaleDto)

    // 2. Verificar disponibilidad de asientos
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

    // 3. Calcular precios y crear estructura de datos
    const ticketsData = await this.prepareTicketsData(createSaleDto)
    const totals = this.calculateTotals(ticketsData)

    // 4. Determinar estado inicial del pago según método
    const paymentStatus = this.getInitialPaymentStatus(
      createSaleDto.paymentMethod,
    )

    const paymentData = {
      amount: totals.amount,
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      discounts: totals.discounts,
      paymentMethod: createSaleDto.paymentMethod,
      status: paymentStatus,
      paypalTransactionId: createSaleDto.paypalTransactionId,
      bankReference: createSaleDto.bankReference,
      receiptUrl: createSaleDto.receiptUrl,
      isOnlinePayment: true,
      user: { connect: { id: createSaleDto.customerId } },
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
      message: this.getResponseMessage(paymentStatus),
      totalTickets: ticketsData.length,
    }
  }

  private async validateSaleData(
    createSaleDto: CreateOnlineSaleDto,
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

    const customer = await this.ticketSaleRepository.findUserById(
      createSaleDto.customerId,
    )
    if (!customer || customer.role !== 'CUSTOMER') {
      throw new NotFoundException('Cliente no encontrado o no válido')
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

    this.validatePaymentMethodData(createSaleDto)

    this.validatePassengerIdentifications(createSaleDto.passengers)
  }

  private validatePaymentMethodData(createSaleDto: CreateOnlineSaleDto): void {
    switch (createSaleDto.paymentMethod) {
      case PaymentMethod.PAYPAL:
        if (!createSaleDto.paypalTransactionId) {
          throw new BadRequestException(
            'ID de transacción de PayPal es requerido',
          )
        }
        break
      case PaymentMethod.TRANSFER:
        if (!createSaleDto.bankReference) {
          throw new BadRequestException(
            'Referencia bancaria es requerida para transferencias',
          )
        }
        if (!createSaleDto.receiptUrl) {
          throw new BadRequestException(
            'Comprobante de pago es requerido para transferencias',
          )
        }
        break
      case PaymentMethod.CASH:
        throw new BadRequestException(
          'Pago en efectivo no está disponible para ventas online',
        )
    }
  }

  private validatePassengerIdentifications(
    passengers: {
      passengerId: string
      passengerName: string
      passengerType: PassengerType
      physicalSeatId: number
    }[],
  ): void {
    for (const passenger of passengers) {
      if (passenger.passengerType === PassengerType.MINOR) {
        // Validar que la cédula corresponde a un menor de edad
        const age = this.calculateAgeFromId(passenger.passengerId)
        if (age >= 18) {
          throw new BadRequestException(
            `La identificación ${passenger.passengerId} no corresponde a un menor de edad`,
          )
        }
      }
    }
  }

  private calculateAgeFromId(dni: string): number {
    if (dni.length !== 10) return 0

    const year = parseInt(dni.substring(4, 6))
    const month = parseInt(dni.substring(2, 4))
    const day = parseInt(dni.substring(0, 2))

    const fullYear = year + (year > 50 ? 1900 : 2000)
    const birthDate = new Date(fullYear, month - 1, day)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }

    return age
  }

  private async prepareTicketsData(createSaleDto: CreateOnlineSaleDto) {
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

  private getInitialPaymentStatus(paymentMethod: PaymentMethod): PaymentStatus {
    switch (paymentMethod) {
      case PaymentMethod.PAYPAL:
        return PaymentStatus.APPROVED // PayPal se aprueba inmediatamente si la transacción es exitosa
      case PaymentMethod.TRANSFER:
        return PaymentStatus.PENDING // Transferencias requieren validación manual
      default:
        return PaymentStatus.PENDING
    }
  }

  private getResponseMessage(paymentStatus: PaymentStatus): string {
    switch (paymentStatus) {
      case PaymentStatus.APPROVED:
        return 'Compra procesada exitosamente. Sus boletos están listos.'
      case PaymentStatus.PENDING:
        return 'Compra registrada. Su pago está pendiente de validación. Recibirá una notificación cuando sea aprobado.'
      default:
        return 'Compra procesada.'
    }
  }

  async getCustomerTickets(
    customerId: number,
    limit: number = 10,
    offset: number = 0,
  ) {
    const customer = await this.ticketSaleRepository.findUserById(customerId)
    if (!customer || customer.role !== 'CUSTOMER') {
      throw new NotFoundException('Cliente no encontrado')
    }

    return this.ticketSaleRepository.findTicketsByCustomerId(
      customerId,
      limit,
      offset,
    )
  }

  async getTicketByAccessCode(accessCode: string, customerId: number) {
    const ticket = await this.ticketSaleRepository.findTicketByAccessCode(
      accessCode,
      customerId,
    )

    if (!ticket) {
      throw new NotFoundException('Boleto no encontrado')
    }

    return ticket
  }
}
