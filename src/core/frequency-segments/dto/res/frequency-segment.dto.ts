import { ApiProperty } from '@nestjs/swagger'

class LocationDto {
  @ApiProperty({
    description: 'The location id',
    example: 6,
  })
  id: number

  @ApiProperty({
    description: 'The location name',
    example: 'Durán',
  })
  name: string

  @ApiProperty({
    description: 'The province name',
    example: 'Guayas',
  })
  province: string
}

export class FrequencySegmentResDto {
  @ApiProperty({
    description: 'The frequency segment id',
    example: 3,
  })
  id: number

  @ApiProperty({
    description: 'The segment price',
    example: 1,
  })
  price: number

  @ApiProperty({
    description: 'The origin location',
    type: LocationDto,
  })
  origin: LocationDto

  @ApiProperty({
    description: 'The destination location',
    type: LocationDto,
  })
  destination: LocationDto
}
