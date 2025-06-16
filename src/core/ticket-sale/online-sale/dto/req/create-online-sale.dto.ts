import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { TicketInfoDtoReq } from 'src/core/ticket-sale/dto/req/ticket-info.dto'
import { PAYMENT_METHOD } from 'src/core/ticket-sale/types/payment-method'

export class CreateOnlineSaleDto {
  @ApiProperty({ enum: PAYMENT_METHOD, description: 'Payment method' })
  @IsEnum(PAYMENT_METHOD)
  paymentMethod: PAYMENT_METHOD

  @ApiPropertyOptional({ description: 'ID de transacción de PayPal' })
  @IsOptional()
  @IsString()
  paypalTransactionId?: string

  @ApiPropertyOptional({
    description: 'Referencia bancaria (para transferencias)',
  })
  @IsOptional()
  @IsString()
  bankReference?: string

  @ApiPropertyOptional({ description: 'URL del comprobante de pago' })
  @IsOptional()
  @IsString()
  receiptUrl?: string

  @ValidateIf(() => false)
  userId: number

  @ApiProperty({
    type: [TicketInfoDtoReq],
    description: 'Tickets info',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketInfoDtoReq)
  tickets: TicketInfoDtoReq[]
}
