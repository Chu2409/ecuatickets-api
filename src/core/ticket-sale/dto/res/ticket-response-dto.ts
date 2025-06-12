import { ApiProperty } from '@nestjs/swagger'
import { PassengerType } from '@prisma/client'

export class TicketResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  passengerId: string

  @ApiProperty()
  passengerName: string

  @ApiProperty({ enum: PassengerType })
  passengerType: PassengerType

  @ApiProperty()
  price: number

  @ApiProperty()
  basePrice: number

  @ApiProperty()
  discount: number

  @ApiProperty()
  accessCode: string

  @ApiProperty()
  status: string

  @ApiProperty()
  receiptUrl?: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  origin: {
    id: number
    name: string
    province: string
  }

  @ApiProperty()
  destination: {
    id: number
    name: string
    province: string
  }

  @ApiProperty()
  physicalSeat: {
    id: number
    seatNumber: string
    seatType: {
      name: string
      description: string
    }
  }
}
