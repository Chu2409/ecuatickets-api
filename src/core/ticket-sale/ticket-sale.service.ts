import { Injectable } from '@nestjs/common'
import { TicketSaleRepository } from './ticket-sale.repository'

@Injectable()
export class TicketSaleService {
  constructor(private readonly ticketSaleRepository: TicketSaleRepository) {}

  // async validatePayment(paymentId: number, clerkId: number): Promise<void> {
  //   const payment = await this.ticketSaleRepository.findPaymentById(paymentId)

  //   if (!payment) {
  //     throw new NotFoundException('Pago no encontrado')
  //   }

  //   if (payment.status !== PaymentStatus.PENDING) {
  //     throw new BadRequestException('El pago no está pendiente de validación')
  //   }

  //   const user = await this.ticketSaleRepository.updatePaymentStatus(
  //     paymentId,
  //     PaymentStatus.APPROVED,
  //     clerkId,
  //   )

  //   if (user) {
  //     const person = await this.ticketSaleRepository.findPersonById(
  //       user.personId,
  //     )
  //     if (person?.email) {
  //       await this.emailService.sendEmail(
  //         person.email,
  //         payment.amount,
  //         payment.updatedAt
  //           ? payment.updatedAt.toISOString()
  //           : 'Fecha no disponible',
  //       )
  //     }
  //   }
  // }

  // async rejectPayment(paymentId: number, clerkId: number): Promise<void> {
  //   const payment = await this.ticketSaleRepository.findPaymentById(paymentId)

  //   if (!payment) {
  //     throw new NotFoundException('Pago no encontrado')
  //   }

  //   if (payment.status !== PaymentStatus.PENDING) {
  //     throw new BadRequestException('El pago no está pendiente de validación')
  //   }

  //   await this.ticketSaleRepository.updatePaymentStatus(
  //     paymentId,
  //     PaymentStatus.REJECTED,
  //     clerkId,
  //   )
  // }
}
