import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, Min, Max, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator'

export type BusType =
  | 'CONVENCIONAL'
  | 'EJECUTIVO'
  | 'SEMI_CAMA'
  | 'CAMA'
  | 'DOBLE_PISO'
  | 'DOBLE_PISO_EJECUTIVO'
  | 'MICROBUS'

export class CreateBusCustomizationReqDto {
  @ApiProperty({
    description: 'Tipo de bus',
    enum: [
      'CONVENCIONAL',
      'EJECUTIVO',
      'SEMI_CAMA',
      'CAMA',
      'DOBLE_PISO',
      'DOBLE_PISO_EJECUTIVO',
      'MICROBUS',
    ],
    example: 'CONVENCIONAL',
  })
  @IsEnum([
    'CONVENCIONAL',
    'EJECUTIVO',
    'SEMI_CAMA',
    'CAMA',
    'DOBLE_PISO',
    'DOBLE_PISO_EJECUTIVO',
    'MICROBUS',
  ])
  type: BusType

  @ApiProperty({
    description: 'Cantidad de asientos (opcional, por defecto según tipo)',
    example: 46,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  seats?: number

  @ApiProperty({
    description: 'Cantidad de pisos (opcional, por defecto según tipo)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  floors?: number

  @ApiProperty({
    description: 'IDs o números de asientos VIP (opcional)',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  vipSeats?: number[]

  @ApiProperty({
    description: 'ID of the seat type to add (opcional, por defecto 1)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  seatTypeId?: number

  @ApiProperty({
    description: 'Number of seats to add',
    example: 20,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number

  @ApiProperty({
    description: 'Floor level (1 for ground floor, 2 for upper floor)',
    example: 1,
    minimum: 1,
    maximum: 2,
  })
  @IsInt()
  @Min(1)
  @Max(2)
  floor: number
}
