import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { PassengerType, Prisma } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { TicketData, TicketSaleRepository } from '../ticket-sale.repository'
import { CreateCounterSaleDto } from './dto/req/create-counter-sale.dto'
import { TICKET_STATUS } from '../types/ticket-status'
import { TicketInfoDtoReq } from '../dto/req/ticket-info.dto'
import { PAYMENT_STATUS } from '../types/payment-status'

@Injectable()
export class CounterSalesService {
  constructor(private readonly ticketSaleRepository: TicketSaleRepository) {}

  public async processCounterSale(dto: CreateCounterSaleDto) {
    const ticketsData = await this.prepareTicketsData(dto.tickets)
    const paymentData = this.preparePaymentData(ticketsData, dto)

    await this.ticketSaleRepository.createPayment(ticketsData, paymentData)

    if (paymentData.status === PAYMENT_STATUS.APPROVED) {
      const physicalSeats = ticketsData.map((ticket) => ticket.physicalSeatId)
      await this.ticketSaleRepository.updatePhysicalSeatsStatus(physicalSeats)
    }
    return {
      success: true,
      message: 'Venta procesada correctamente',
      paymentId: paymentData.id,
      tickets: ticketsData.map((ticket) => ({
        ...ticket,
        accessCode: ticket.accessCode,
      })),
    }
  }

  private preparePaymentData(
    tickets: TicketData[],
    dto: CreateCounterSaleDto,
  ): Prisma.PaymentCreateManyInput {
    const subtotal = tickets.reduce((acc, ticket) => acc + ticket.price, 0)
    const discounts = tickets.reduce(
      (acc, ticket) => acc + (ticket.discount ?? 0),
      0,
    )
    const total = subtotal - discounts

    return {
      paymentMethod: dto.paymentMethod,
      bankReference: dto.bankReference,
      userId: dto.userId,
      status: dto.paymentStatus,
      subtotal,
      total,
      discounts,
    }
  }

  private async prepareTicketsData(dto: TicketInfoDtoReq[]) {
    const ticketsData: TicketData[] = []

    for (const ticket of dto) {
      const frequencySegmentPrice =
        await this.ticketSaleRepository.findFrequencySegmentPriceById(
          ticket.frecuencySegmentPriceId,
        )
      if (!frequencySegmentPrice) {
        throw new NotFoundException(
          `Segmento de frecuencia con ID ${ticket.frecuencySegmentPriceId} no encontrado`,
        )
      }

      const physicalSeat = await this.ticketSaleRepository.findSeatById(
        ticket.physicalSeatId,
      )
      if (!physicalSeat || physicalSeat.isTaken) {
        throw new ConflictException(
          `El asiento ${ticket.physicalSeatId} no está disponible para este segmento`,
        )
      }

      const frequency = await this.ticketSaleRepository.findFrequencyById(
        ticket.frecuencySegmentPriceId,
      )
      if (!frequency) {
        throw new NotFoundException(
          `Frecuencia con ID ${ticket.frecuencySegmentPriceId} no encontrada`,
        )
      }

      const routeSheet = await this.ticketSaleRepository.findRouteSheet(
        frequency.id,
        ticket.date,
      )
      if (!routeSheet) {
        throw new NotFoundException(
          `Precio de segmento con ID ${ticket.frecuencySegmentPriceId} no encontrado`,
        )
      }

      // 4. Calcular precios
      const price =
        frequencySegmentPrice.price * physicalSeat.seatType.valueToApply
      const discount = this.calculateDiscount(price, ticket.passengerType)
      const finalPrice = price - discount

      ticketsData.push({
        passengerId: ticket.passengerId,
        passengerType: ticket.passengerType,
        passenger: {
          dni: ticket.passsengerDni,
          name: ticket.passengerName,
          surname: ticket.passengerSurname,
          email: ticket.passengerEmail,
          birthDate: ticket.passengerBirthDate,
        },
        price: finalPrice,
        basePrice: frequencySegmentPrice.price,
        discount,
        accessCode: this.generateAccessCode(),
        routeSheetId: routeSheet.id,
        physicalSeatId: ticket.physicalSeatId,
        originId: frequencySegmentPrice.originId,
        destinationId: frequencySegmentPrice.destinationId,
        status: TICKET_STATUS.ACTIVE,
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

  private generateAccessCode(): string {
    return uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()
  }

  public async validatePayment(paymentId: number) {
    const payment = await this.ticketSaleRepository.updatePaymentStatus(
      paymentId,
      PAYMENT_STATUS.APPROVED,
    )
    return payment
  }

  public async rejectPayment(paymentId: number) {
    const payment = await this.ticketSaleRepository.updatePaymentStatus(
      paymentId,
      PAYMENT_STATUS.REJECTED,
    )
    return payment
  }
}
