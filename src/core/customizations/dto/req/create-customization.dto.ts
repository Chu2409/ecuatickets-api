import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator'

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

  @IsString()
  @ApiProperty({
    description: 'Código hexadecimal del color seleccionado',
    example: '#FF5733',
  })
  hexCode: string
}
