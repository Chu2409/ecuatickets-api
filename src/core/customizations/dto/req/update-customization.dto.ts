import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsUrl } from 'class-validator'

export class UpdateCustomizationDto {
  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'URL de la imagen de customización',
    example: 'https://example.com/logo.png',
  })
  imageUrl?: string

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Código hexadecimal del color seleccionado',
    example: '#FF5733',
  })
  hexcode: string
}
