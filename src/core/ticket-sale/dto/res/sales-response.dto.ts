import { ApiProperty } from '@nestjs/swagger'
import { PaymentResponseDto } from './payment-response-dto'

export class SaleResponseDto {
  @ApiProperty()
  payment: PaymentResponseDto

  @ApiProperty()
  message: string

  @ApiProperty()
  totalTickets: number
}
