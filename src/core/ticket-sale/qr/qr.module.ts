import { Module } from '@nestjs/common'
import { QrService } from './qr.service'
import { QrController } from './qr.controller'
import { TicketSaleRepository } from '../ticket-sale.repository'

@Module({
  controllers: [QrController],
  providers: [QrService, TicketSaleRepository],
  exports: [QrService],
})
export class QrModule {}
