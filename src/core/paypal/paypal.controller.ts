import { Controller, Param, Post } from '@nestjs/common'
import { PayPalService } from './paypal.service'

@Controller('paypal')
export class PayPalController {
  constructor(private payPalService: PayPalService) {}

  @Post('create')
  async createOrder() {
    const order = await this.payPalService.createOrder('10.00')
    return order
  }

  @Post('capture/:id')
  async capture(@Param('id') orderId: string) {
    const captured = await this.payPalService.captureOrder(orderId)
    return captured
  }
}
