import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsPositive, IsUrl } from 'class-validator'

export class CreateCustomizationDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'ID de la compañía',
    example: 1,
  })
  companyId: number

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'URL de la imagen de customización',
    example: 'https://example.com/logo.png',
  })
  imageUrl?: string

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'ID del color seleccionado',
    example: 1,
  })
  colorId: number
}
