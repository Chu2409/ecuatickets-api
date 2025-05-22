import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class BusResDto {
  @ApiProperty({
    description: 'id de la compañia',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Bus internal number',
    example: 'INT-1234',
  })
  internalNumber: string

  @ApiProperty({
    description: 'Bus license plate',
    example: 'ABC-1234',
  })
  licensePlate: string

  @ApiProperty({
    description: 'Bus chassis brand',
    example: 'Mercedes-Benz',
  })
  chassisBrand: string

  @ApiProperty({
    description: 'Bus body brand',
    example: 'Marcopolo',
  })
  bodyBrand: string

  @ApiPropertyOptional({
    description: 'Photo URL of the bus',
    example: 'https://example.com/bus.jpg',
  })
  photoUrl: string | null

  @ApiProperty({
    description: 'Is the bus active?',
    example: true,
  })
  isActive: boolean
}
