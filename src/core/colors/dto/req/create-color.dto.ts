import { ApiProperty } from '@nestjs/swagger'
import { IsHexColor, IsNotEmpty, IsString } from 'class-validator'

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nombre del color',
    example: 'Azul Corporativo',
  })
  name: string

  @IsHexColor()
  @ApiProperty({
    description: 'Código hexadecimal del color',
    example: '#1E3A8A',
  })
  hexCode: string
}
