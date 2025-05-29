import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsHexColor, IsOptional } from 'class-validator'

export class UpdateColorDto {
  @IsHexColor()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Código hexadecimal del color',
    example: '#1E3A8A',
  })
  hexCode?: string
}
