import { Module } from '@nestjs/common'
import { TicketSaleController } from './ticket-sale.controller'
import { CounterSalesService } from './counter-sale/counter-sale.service'
import { OnlineSalesService } from './online-sale/online-sale.service'
import { TicketSaleRepository } from './ticket-sale.repository'
import { EmailService } from '../email/email.service'

@Module({
  controllers: [TicketSaleController],
  providers: [
    CounterSalesService,
    OnlineSalesService,
    TicketSaleRepository,
    EmailService,
  ],
})
export class TicketSaleModule {}
