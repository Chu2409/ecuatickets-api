import { ApiProperty } from '@nestjs/swagger'
import { IsHexColor } from 'class-validator'

export class CreateColorDto {
  @IsHexColor()
  @ApiProperty({
    description: 'Código hexadecimal del color',
    example: '#1E3A8A',
  })
  hexCode: string
}
