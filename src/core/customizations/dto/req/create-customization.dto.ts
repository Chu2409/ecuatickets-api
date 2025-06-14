import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator'

export class CreateCustomizationDto {
  @ValidateIf(() => false)
  companyId: number

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'URL de la imagen de customización',
    example: 'https://example.com/logo.png',
  })
  imageUrl?: string

  @IsString()
  @ApiProperty({
    description: 'Código hexadecimal del color seleccionado',
    example: '#FF5733',
  })
  hexcode: string
}
