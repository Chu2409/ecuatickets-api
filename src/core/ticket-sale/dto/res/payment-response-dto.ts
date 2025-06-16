import { ApiProperty } from '@nestjs/swagger'
import { PaymentMethod } from '@prisma/client'
import { TicketResponseDto } from './ticket-response-dto'

export class PaymentResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  amount: number

  @ApiProperty()
  subtotal: number

  @ApiProperty()
  taxes?: number

  @ApiProperty()
  discounts?: number

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod

  @ApiProperty()
  status: string

  @ApiProperty()
  receiptUrl?: string

  @ApiProperty()
  isOnlinePayment: boolean

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ type: [TicketResponseDto] })
  tickets: TicketResponseDto[]
}
