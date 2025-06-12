import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PaymentMethod } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { PassengerInfoDto } from 'src/core/ticket-sale/dto/req/passenger-info.dto'

export class CreateOnlineSaleDto {
  @ApiProperty({ description: 'ID de la hoja de ruta' })
  @IsNumber()
  routeSheetId: number

  @ApiProperty({ description: 'Ciudad de origen' })
  @IsNumber()
  originId: number

  @ApiProperty({ description: 'Ciudad de destino' })
  @IsNumber()
  destinationId: number

  @ApiProperty({
    type: [PassengerInfoDto],
    description: 'Información de los pasajeros',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerInfoDto)
  passengers: PassengerInfoDto[]

  @ApiProperty({ enum: PaymentMethod, description: 'Método de pago' })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

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

  @ApiProperty({ description: 'ID del usuario cliente' })
  @IsNumber()
  customerId: number
}
