import { ApiProperty } from '@nestjs/swagger'

export class CounterSaleResDto {
  @ApiProperty({
    description: 'The id of the counter sale',
    example: 101,
  })
  id: number

  @ApiProperty({
    description: 'The status of the payment',
    example: 'PAID',
  })
  paymentStatus: string
}
