import { ApiProperty } from '@nestjs/swagger'

export class CityResDto {
  @ApiProperty({
    description: 'id de la compañia',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'City name',
    example: 'Machala',
  })
  name: string

  @ApiProperty({
    description: 'Province name',
    example: 'El Oro',
  })
  province: string
}
