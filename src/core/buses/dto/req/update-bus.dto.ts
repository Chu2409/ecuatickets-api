import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { CreateBusReqDto } from './create-bus.dto'
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator'

export class UpdateBusReqDto extends PartialType(CreateBusReqDto) {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Bus internal number',
    example: 'INT-1234',
  })
  internalNumber?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Bus license plate',
    example: 'ABC-1234',
  })
  licensePlate?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Bus chassis brand',
    example: 'Mercedes-Benz',
  })
  chassisBrand?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Bus body brand',
    example: 'Marcopolo',
  })
  bodyBrand?: string

  @IsUrl()
  @IsOptional()
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

  @ValidateIf(() => false)
  companyId: number
}
