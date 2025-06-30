import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { PassengerType, Prisma } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { TicketData, TicketSaleRepository } from '../ticket-sale.repository'
import { CreateCounterSaleDto } from './dto/req/create-counter-sale.dto'
import { TICKET_STATUS } from '../types/ticket-status'
import { TicketInfoDtoReq } from '../dto/req/ticket-info.dto'
import { PAYMENT_STATUS } from '../types/payment-status'
import { PAYMENT_METHOD } from '../types/payment-method'
import { EmailService } from 'src/core/email/email.service'
import { DatabaseService } from 'src/global/database/database.service'
import { PayPalService } from 'src/core/paypal/paypal.service'

@Injectable()
export class CounterSalesService {
  constructor(
    private readonly ticketSaleRepository: TicketSaleRepository,
    private readonly emailService: EmailService,
    private readonly prisma: DatabaseService,
    private readonly paypalService: PayPalService,
  ) { }

  public async processCounterSale(dto: CreateCounterSaleDto) {
    const ticketsData = await this.prepareTicketsData(dto.tickets)
    const paymentData = this.preparePaymentData(ticketsData, dto)

    const payment = await this.ticketSaleRepository.createPayment(
      ticketsData,
      paymentData,
    )

    if (paymentData.status === PAYMENT_STATUS.APPROVED) {
      const physicalSeats = ticketsData.map((ticket) => ticket.physicalSeatId)
      await this.ticketSaleRepository.updatePhysicalSeatsStatus(physicalSeats)

      // Get user's email from database
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
        include: { person: true },
      })

      // Send confirmation email if user has an email
      if (user?.person?.email) {
        await this.emailService.sendEmail(
          user.person.email,
          payment.total,
          new Date().toISOString(),
        )
      }
    }

    return {
      success: true,
      message: 'Venta procesada correctamente',
      paymentId: payment.id,
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

  public async validatePayment(paymentId: number, paypalOrderId?: string) {
    // Get payment details first
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          include: {
            person: true,
          },
        },
      },
    })

    if (!payment) {
      throw new NotFoundException('Pago no encontrado')
    }

    // If payment is PayPal, verify it first
    if (payment.paymentMethod === PAYMENT_METHOD.PAYPAL) {
      if (!paypalOrderId) {
        throw new BadRequestException(
          'ID de transacción PayPal es requerido para validar el pago',
        )
      }

      try {
        const captureResult =
          await this.paypalService.captureOrder(paypalOrderId)

        if (captureResult.status !== 'COMPLETED') {
          await this.ticketSaleRepository.updatePaymentStatus(
            paymentId,
            PAYMENT_STATUS.REJECTED,
          )
          throw new BadRequestException(
            'El pago de PayPal no se completó correctamente',
          )
        }

        // Update PayPal transaction ID in the payment
        await this.prisma.payment.update({
          where: { id: paymentId },
          data: {
            paypalTransactionId: paypalOrderId,
          },
        })
      } catch (error) {
        throw new BadRequestException('Error al verificar el pago de PayPal')
      }
    }

    // Update payment status to APPROVED
    const updatedPayment = await this.ticketSaleRepository.updatePaymentStatus(
      paymentId,
      PAYMENT_STATUS.APPROVED,
    )

    // Get tickets for this payment
    const tickets =
      await this.ticketSaleRepository.findTicketsByPaymentId(paymentId)
    const physicalSeats = tickets.map((ticket) => ticket.physicalSeatId)
    await this.ticketSaleRepository.updatePhysicalSeatsStatus(physicalSeats)

    // Send confirmation email if user has an email
    if (updatedPayment.user?.person?.email) {
      await this.emailService.sendEmail(
        updatedPayment.user.person.email,
        updatedPayment.total,
        new Date().toISOString(),
      )
    }

    return {
      success: true,
      message: 'Pago aprobado correctamente',
      payment: updatedPayment,
      tickets,
    }
  }

  public async rejectPayment(paymentId: number) {
    const payment = await this.ticketSaleRepository.updatePaymentStatus(
      paymentId,
      PAYMENT_STATUS.REJECTED,
    )
    return {
      success: true,
      message: 'Pago rechazado correctamente',
      payment,
    }
  }

  public async getPendingTransferPayments() {
    const payments = await this.ticketSaleRepository.findPendingTransferPayments()

    return {
      success: true,
      message: 'Pagos pendientes por transferencia obtenidos correctamente',
      data: payments,
      total: payments.length,
    }
  }
}
