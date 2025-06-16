import { ApiProperty } from '@nestjs/swagger'

export class SeatConfigurationDto {
  @ApiProperty({
    description: 'Seat type name',
    example: 'Standard',
  })
  seatType: string

  @ApiProperty({
    description: 'Quantity of this seat type',
    example: 20,
  })
  quantity: number
}

export class BusConfigurationResDto {
  @ApiProperty({
    description: 'Bus ID',
    example: 1,
  })
  busId: number

  @ApiProperty({
    description: 'Total number of seats',
    example: 40,
  })
  totalSeats: number

  @ApiProperty({
    description: 'Seat configurations',
    type: [SeatConfigurationDto],
  })
  configurations: SeatConfigurationDto[]

  @ApiProperty({
    description: 'Available floors',
    example: [1, 2],
  })
  floors: number[]

  @ApiProperty({
    description: 'Range of seat numbers',
    example: '1 - 40',
  })
  seatRange: string
}
