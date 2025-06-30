import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { PassengerType, Prisma } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { TicketSaleRepository } from '../ticket-sale.repository'
import { CreateOnlineSaleDto } from './dto/req/create-online-sale.dto'
import { EmailService } from 'src/core/email/email.service'
import { PayPalService } from 'src/core/paypal/paypal.service'
import { TICKET_STATUS } from '../types/ticket-status'
import { TicketData } from '../ticket-sale.repository'
import { PAYMENT_STATUS } from '../types/payment-status'
import { PAYMENT_METHOD } from '../types/payment-method'
import { TicketInfoDtoReq } from '../dto/req/ticket-info.dto'

@Injectable()
export class OnlineSalesService {
  constructor(
    private readonly ticketSaleRepository: TicketSaleRepository,
    private readonly emailService: EmailService,
    private readonly paypalService: PayPalService,
  ) {}

  public async processOnlineSale(dto: CreateOnlineSaleDto) {
    const ticketsData = await this.prepareTicketsData(dto.tickets)
    const paymentData = this.preparePaymentData(ticketsData, dto)

    // Create payment and tickets in PENDING status
    const payment = await this.ticketSaleRepository.createPayment(
      ticketsData,
      paymentData,
    )

    // Handle PayPal payment flow
    if (dto.paymentMethod === PAYMENT_METHOD.PAYPAL) {
      const paypalOrder = await this.paypalService.createOrder(
        paymentData.total.toString(),
      )
      return {
        success: true,
        message: 'PayPal order created successfully',
        paymentId: payment.id,
        paypalOrderId: paypalOrder.id,
        approvalUrl: paypalOrder.links.find((link) => link.rel === 'approve')
          .href,
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

  public async verifyPayPalPayment(paymentId: number, paypalOrderId: string) {
    try {
      const captureResult = await this.paypalService.captureOrder(paypalOrderId)

      if (captureResult.status === 'COMPLETED') {
        const payment = await this.ticketSaleRepository.updatePaymentStatus(
          paymentId,
          PAYMENT_STATUS.APPROVED,
        )

        // Update physical seats status
        const tickets =
          await this.ticketSaleRepository.findTicketsByPaymentId(paymentId)
        const physicalSeats = tickets.map((ticket) => ticket.physicalSeatId)
        await this.ticketSaleRepository.updatePhysicalSeatsStatus(physicalSeats)

        // Send confirmation email if user has an email
        if (payment.user.person.email) {
          await this.emailService.sendEmail(
            payment.user.person.email,
            payment.total,
            new Date().toISOString(),
          )
        }

        return {
          success: true,
          message: 'Pago verificado y procesado correctamente',
          payment,
          tickets,
        }
      }

      throw new BadRequestException(
        'El pago de PayPal no se completó correctamente',
      )
    } catch (error) {
      await this.ticketSaleRepository.updatePaymentStatus(
        paymentId,
        PAYMENT_STATUS.REJECTED,
      )
      throw new BadRequestException('Error al verificar el pago de PayPal')
    }
  }

  private verifyPaymentType(dto: CreateOnlineSaleDto) {
    switch (dto.paymentMethod) {
      case PAYMENT_METHOD.PAYPAL:
        // No need to verify paypalTransactionId anymore
        break
      case PAYMENT_METHOD.TRANSFER:
        if (!dto.bankReference || !dto.receiptUrl) {
          throw new BadRequestException(
            'Bank reference and receipt URL are required for bank transfers',
          )
        }
        break
      default:
        throw new BadRequestException('Invalid payment method for online sales')
    }
  }

  private preparePaymentData(
    tickets: TicketData[],
    dto: CreateOnlineSaleDto,
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
      paypalTransactionId: dto.paypalTransactionId,
      receiptUrl: dto.receiptUrl,
      status: PAYMENT_STATUS.PENDING, // Online sales are pre-verified
      subtotal,
      total,
      discounts,
      userId: dto.userId,
      isOnlinePayment: true,
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
      )
      if (!routeSheet) {
        throw new NotFoundException(
          `Precio de segmento con ID ${ticket.frecuencySegmentPriceId} no encontrado`,
        )
      }

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

  private async sendConfirmationEmail(tickets: TicketData[]) {
    // Group tickets by passenger email
    const ticketsByEmail = tickets.reduce(
      (acc, ticket) => {
        if (ticket.passenger.email) {
          if (!acc[ticket.passenger.email]) {
            acc[ticket.passenger.email] = []
          }
          acc[ticket.passenger.email].push(ticket)
        }
        return acc
      },
      {} as Record<string, TicketData[]>,
    )

    // Send email to each passenger
    for (const [email, passengerTickets] of Object.entries(ticketsByEmail)) {
      const totalPaid = passengerTickets.reduce(
        (acc, ticket) => acc + ticket.price,
        0,
      )
      await this.emailService.sendEmail(
        email,
        totalPaid,
        new Date().toISOString(),
      )
    }
  }

  public async getPendingTransferPaymentsByUser(userId: number) {
    const payments =
      await this.ticketSaleRepository.findPendingTransferPaymentsByUserId(
        userId,
      )

    return {
      success: true,
      message: 'Pagos pendientes por transferencia obtenidos correctamente',
      data: payments,
      total: payments.length,
    }
  }
}
