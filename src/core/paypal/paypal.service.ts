import { Injectable } from '@nestjs/common'
import * as checkoutNodeJSSdk from '@paypal/checkout-server-sdk'
import { CustomConfigService } from 'src/global/config/config.service'

@Injectable()
export class PayPalService {
  private environment: checkoutNodeJSSdk.core.SandboxEnvironment
  private client: checkoutNodeJSSdk.core.PayPalHttpClient

  constructor(private readonly configService: CustomConfigService) {
    this.environment = new checkoutNodeJSSdk.core.SandboxEnvironment(
      this.configService.env.PAYPAL_CLIENT_ID,
      this.configService.env.PAYPAL_SECRET,
    )
    this.client = new checkoutNodeJSSdk.core.PayPalHttpClient(this.environment)
  }

  async createOrder(amount: string, currency = 'USD') {
    const order = new checkoutNodeJSSdk.orders.OrdersCreateRequest()
    order.headers = {
      Prefer: 'return=representation',
      'Content-Type': 'application/json',
    }
    order.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
    })
    const response = await this.client.execute(order)
    return response.result
  }

  async captureOrder(id: string) {
    const capture = new checkoutNodeJSSdk.orders.OrdersCaptureRequest(id)
    capture.requestBody = {}

    const response = await this.client.execute(capture)
    return response.result
  }
}
