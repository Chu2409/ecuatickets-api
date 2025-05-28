import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsPositive, IsUrl } from 'class-validator'

export class UpdateCustomizationDto {
  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'URL de la imagen de customización',
    example: 'https://example.com/logo.png',
  })
  imageUrl?: string

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ID del color seleccionado',
    example: 1,
  })
  colorId?: number
}
