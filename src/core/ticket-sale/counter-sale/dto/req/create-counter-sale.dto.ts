import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { TicketInfoDtoReq } from '../../../dto/req/ticket-info.dto'
import { Type } from 'class-transformer'
import { PAYMENT_METHOD } from 'src/core/ticket-sale/types/payment-method'
import { PAYMENT_STATUS } from 'src/core/ticket-sale/types/payment-status'

export class CreateCounterSaleDto {
  @ApiProperty({ enum: PAYMENT_METHOD, description: 'Payment method' })
  @IsEnum(PAYMENT_METHOD)
  paymentMethod: PAYMENT_METHOD

  @ApiProperty({
    enum: PAYMENT_STATUS,
    description: 'Payment status',
    example: PAYMENT_STATUS.PENDING,
  })
  @IsEnum(PAYMENT_STATUS)
  paymentStatus: PAYMENT_STATUS

  @ApiPropertyOptional({
    description: 'Bank reference (for transfers)',
  })
  @IsOptional()
  @IsString()
  bankReference?: string

  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  userId: number

  @ValidateIf(() => false)
  clerkId: number

  @ApiProperty({
    type: [TicketInfoDtoReq],
    description: 'Tickets info',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketInfoDtoReq)
  tickets: TicketInfoDtoReq[]
}
