import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateSeatTypeReqDto } from './create-seat-type.dto'
import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator'

export class UpdateSeatTypeReqDto extends PartialType(CreateSeatTypeReqDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Name of the seat type',
    example: 'Economy',
  })
  name?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the seat type',
    example: 'Standard economy class seat with basic amenities',
    required: false,
  })
  description?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Value to apply for the seat type',
    example: 150.5,
    type: 'number',
    format: 'float',
  })
  valueToApply?: number

  @ValidateIf(() => false)
  companyId: number
}
