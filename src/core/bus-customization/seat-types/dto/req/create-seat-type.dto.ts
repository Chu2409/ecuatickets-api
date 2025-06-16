import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString,  ValidateIf } from 'class-validator'

export class CreateSeatTypeReqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the seat type',
    example: 'Economy',
  })
  name: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the seat type',
    example: 'Standard economy class seat with basic amenities',
    required: false,
  })
  description?: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Value to apply for the seat type',
    example: 150.5,
    type: 'number',
    format: 'float',
  })
  valueToApply: number


  @ValidateIf(() => false)
  companyId: number
}
