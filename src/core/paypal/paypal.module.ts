import { Module } from '@nestjs/common'
import { PayPalController } from './paypal.controller'
import { PayPalService } from './paypal.service'

@Module({
  controllers: [PayPalController],
  providers: [PayPalService],
})
export class PaypalModule {}
