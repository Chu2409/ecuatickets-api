import { ApiProperty } from '@nestjs/swagger'

export class SeatDto {
  @ApiProperty({
    description: 'Unique identifier for the seat',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Seat number',
    example: '1A',
  })
  seatNumber: string

  @ApiProperty({
    description: 'Row number',
    example: 1,
  })
  row: number

  @ApiProperty({
    description: 'Column number',
    example: 1,
  })
  column: number

  @ApiProperty({
    description: 'Floor number',
    example: 1,
  })
  floor: number

  @ApiProperty({
    description: 'Seat type name',
    example: 'Standard',
  })
  seatType: string

  @ApiProperty({
    description: 'Seat type value/price',
    example: 25.50,
  })
  seatValue: number

  @ApiProperty({
    description: 'Whether the seat is taken',
    example: false,
  })
  isTaken: boolean
}

export class BusSeatsResDto {
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
    description: 'Number of floors',
    example: 1,
  })
  floors: number

  @ApiProperty({
    description: 'Seats organized by floor',
    example: {
      1: [
        {
          id: 1,
          seatNumber: '1A',
          row: 1,
          column: 1,
          floor: 1,
          seatType: 'Standard',
          seatValue: 25.50,
          isTaken: false,
        },
      ],
    },
  })
  seatsByFloor: Record<number, SeatDto[]>
}
