import { Module } from '@nestjs/common'
import { TicketSaleController } from './ticket-sale.controller'
import { CounterSalesService } from './counter-sale/counter-sale.service'
import { OnlineSalesService } from './online-sale/online-sale.service'
import { TicketSaleRepository } from './ticket-sale.repository'
import { EmailService } from '../email/email.service'
import { QrModule } from './qr/qr.module'
import { PurchaseHistoryModule } from './purchase-history/purchase-history.module'
import { PayPalService } from '../paypal/paypal.service'
import { TicketSaleService } from './ticket-sale.service'

@Module({
  imports: [QrModule, PurchaseHistoryModule],
  controllers: [TicketSaleController],
  providers: [
    CounterSalesService,
    OnlineSalesService,
    TicketSaleRepository,
    EmailService,
    PayPalService,
    TicketSaleService,
  ],
  exports: [QrModule, PurchaseHistoryModule],
})
export class TicketSaleModule {}
