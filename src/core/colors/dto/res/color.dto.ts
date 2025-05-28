import { ApiProperty } from '@nestjs/swagger'

export class ColorResDto {
  @ApiProperty({
    description: 'ID del color',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nombre del color',
    example: 'Azul Corporativo',
  })
  name: string

  @ApiProperty({
    description: 'Código hexadecimal del color',
    example: '#1E3A8A',
  })
  hexCode: string
}
