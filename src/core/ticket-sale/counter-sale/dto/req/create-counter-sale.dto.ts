import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { PassengerInfoDto } from '../../../dto/req/passenger-info.dto'
import { Type } from 'class-transformer'
import { PaymentMethod } from '@prisma/client'

export class CreateCounterSaleDto {
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

  @ApiPropertyOptional({
    description: 'Referencia bancaria (para transferencias)',
  })
  @IsOptional()
  @IsString()
  bankReference?: string

  @ApiProperty({
    description: 'ID del usuario que realiza la venta (oficinista)',
  })
  @IsNumber()
  clerkId: number

  @ApiProperty({ description: 'ID de la cooperativa' })
  @IsNumber()
  companyId: number
}
