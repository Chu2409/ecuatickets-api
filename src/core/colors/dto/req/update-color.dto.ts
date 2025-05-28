import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsHexColor, IsOptional, IsString } from 'class-validator'

export class UpdateColorDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Nombre del color',
    example: 'Azul Corporativo',
  })
  name?: string

  @IsHexColor()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Código hexadecimal del color',
    example: '#1E3A8A',
  })
  hexCode?: string
}
