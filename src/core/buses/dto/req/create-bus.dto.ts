import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsPositive,
  IsNumber,
  IsUrl,
} from 'class-validator'

export class CreateBusReqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus internal number',
    example: 'INT-1234',
  })
  internalNumber: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus license plate',
    example: 'ABC-1234',
  })
  licensePlate: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus chassis brand',
    example: 'Mercedes-Benz',
  })
  chassisBrand: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus body brand',
    example: 'Marcopolo',
  })
  bodyBrand: string

  @IsUrl()
  @ApiPropertyOptional({
    description: 'Photo URL of the bus',
    example: 'https://example.com/bus.jpg',
  })
  photoUrl?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Is the bus active?',
    example: true,
  })
  isActive?: boolean

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Company ID that owns the bus',
    example: 1,
  })
  companyId: number
}
