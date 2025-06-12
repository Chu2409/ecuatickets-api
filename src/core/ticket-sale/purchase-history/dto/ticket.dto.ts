import { ApiProperty } from '@nestjs/swagger'
import {
  PassengerType,
  PaymentMethod,
  RouteStatus,
  RouteMode,
} from '@prisma/client'

class CityResDto {
  @ApiProperty({
    description: 'City ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'City name',
    example: 'Quito',
  })
  name: string

  @ApiProperty({
    description: 'Province name',
    example: 'Pichincha',
  })
  province: string
}

class SeatTypeResDto {
  @ApiProperty({
    description: 'Seat type ID',
    example: 2,
  })
  id: number

  @ApiProperty({
    description: 'Seat type name',
    example: 'VIP',
  })
  name: string

  @ApiProperty({
    description: 'Seat type description',
    example: 'Asientos VIP con características especiales',
  })
  description: string

  @ApiProperty({
    description: 'Value multiplier to apply to base price',
    example: 1.3,
  })
  valueToApply: number
}

class PhysicalSeatResDto {
  @ApiProperty({
    description: 'Physical seat ID',
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
    description: 'Bus ID',
    example: 1,
  })
  busId: number

  @ApiProperty({
    description: 'Seat type ID',
    example: 2,
  })
  seatTypeId: number

  @ApiProperty({
    description: 'Seat type information',
    type: SeatTypeResDto,
  })
  seatType: SeatTypeResDto
}

class CompanyResDto {
  @ApiProperty({
    description: 'Company ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Company name',
    example: 'Santa',
  })
  name: string

  @ApiProperty({
    description: 'Company logo URL',
    example: null,
    nullable: true,
  })
  logoUrl: string | null

  @ApiProperty({
    description: 'Company support contact',
    example: null,
    nullable: true,
  })
  supportContact: string | null

  @ApiProperty({
    description: 'Company active status',
    example: true,
  })
  isActive: boolean

  @ApiProperty({
    description: 'Company creation date',
    example: '2025-06-12T02:07:04.251Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Company last update date',
    example: '2025-06-12T02:07:04.251Z',
  })
  updatedAt: Date
}

class FrequencyResDto {
  @ApiProperty({
    description: 'Frequency ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Departure time',
    example: '06:00',
  })
  time: string

  @ApiProperty({
    description: 'Frequency resolution',
    example: '24h',
  })
  resolution: string

  @ApiProperty({
    description: 'Frequency active status',
    example: true,
  })
  active: boolean

  @ApiProperty({
    description: 'Frequency creation date',
    example: '2024-06-01T06:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Company ID',
    example: 1,
  })
  companyId: number

  @ApiProperty({
    description: 'Origin city ID',
    example: 1,
  })
  originId: number

  @ApiProperty({
    description: 'Destination city ID',
    example: 2,
  })
  destinationId: number

  @ApiProperty({
    description: 'Company information',
    type: CompanyResDto,
  })
  company: CompanyResDto
}

class RouteSheetResDto {
  @ApiProperty({
    description: 'Route sheet ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Route date',
    example: '2024-06-01T06:00:00.000Z',
  })
  date: Date

  @ApiProperty({
    description: 'Route status',
    enum: RouteStatus,
    example: 'GENERATED',
  })
  status: RouteStatus

  @ApiProperty({
    description: 'Route mode',
    enum: RouteMode,
    example: 'AUTOMATIC',
  })
  mode: RouteMode

  @ApiProperty({
    description: 'Frequency ID',
    example: 1,
  })
  frequencyId: number

  @ApiProperty({
    description: 'Bus ID',
    example: 1,
  })
  busId: number

  @ApiProperty({
    description: 'Frequency information',
    type: FrequencyResDto,
  })
  frequency: FrequencyResDto
}

class PaymentResDto {
  @ApiProperty({
    description: 'Payment ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Total payment amount',
    example: 22.425,
  })
  amount: number

  @ApiProperty({
    description: 'Payment subtotal',
    example: 19.5,
  })
  subtotal: number

  @ApiProperty({
    description: 'Payment taxes',
    example: 2.925,
  })
  taxes: number

  @ApiProperty({
    description: 'Payment discounts',
    example: 0,
  })
  discounts: number

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: 'TRANSFER',
  })
  paymentMethod: PaymentMethod

  @ApiProperty({
    description: 'Payment status',
    example: 'PENDING',
  })
  status: string

  @ApiProperty({
    description: 'Payment receipt URL',
    example: 'string',
    nullable: true,
  })
  receiptUrl: string | null

  @ApiProperty({
    description: 'PayPal transaction ID',
    example: 'string',
    nullable: true,
  })
  paypalTransactionId: string | null

  @ApiProperty({
    description: 'Bank reference number',
    example: 'string',
    nullable: true,
  })
  bankReference: string | null

  @ApiProperty({
    description: 'User ID who validated the payment',
    example: null,
    nullable: true,
  })
  validatedBy: number | null

  @ApiProperty({
    description: 'Payment validation date',
    example: null,
    nullable: true,
  })
  validatedAt: Date | null

  @ApiProperty({
    description: 'Payment creation date',
    example: '2025-06-12T04:27:51.264Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Payment last update date',
    example: '2025-06-12T04:27:51.264Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Is online payment flag',
    example: true,
  })
  isOnlinePayment: boolean

  @ApiProperty({
    description: 'User ID',
    example: 4,
  })
  userId: number

  @ApiProperty({
    description: 'Company ID',
    example: null,
    nullable: true,
  })
  companyId: number | null
}

export class TicketResDto {
  @ApiProperty({
    description: 'Ticket ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Passenger DNI',
    example: '0703224337',
  })
  passengerId: string

  @ApiProperty({
    description: 'Passenger name',
    example: 'dANIEL',
  })
  passengerName: string

  @ApiProperty({
    description: 'Passenger type',
    enum: PassengerType,
    example: 'NORMAL',
  })
  passengerType: PassengerType

  @ApiProperty({
    description: 'Ticket price',
    example: 19.5,
  })
  price: number

  @ApiProperty({
    description: 'Ticket base price',
    example: 19.5,
  })
  basePrice: number

  @ApiProperty({
    description: 'Ticket discount',
    example: 0,
  })
  discount: number

  @ApiProperty({
    description: 'Ticket access code',
    example: '2031A8DB2CB5',
  })
  accessCode: string

  @ApiProperty({
    description: 'Ticket status',
    example: 'USED',
  })
  status: string

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: 'TRANSFER',
  })
  paymentMethod: PaymentMethod

  @ApiProperty({
    description: 'Receipt URL',
    example: null,
    nullable: true,
  })
  receiptUrl: string | null

  @ApiProperty({
    description: 'Ticket creation date',
    example: '2025-06-12T04:27:51.281Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Ticket last update date',
    example: '2025-06-12T04:29:08.644Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Payment ID',
    example: 1,
  })
  paymentId: number

  @ApiProperty({
    description: 'Route sheet ID',
    example: 1,
  })
  routeSheetId: number

  @ApiProperty({
    description: 'Physical seat ID',
    example: 1,
  })
  physicalSeatId: number

  @ApiProperty({
    description: 'Origin city ID',
    example: 1,
  })
  originId: number

  @ApiProperty({
    description: 'Destination city ID',
    example: 2,
  })
  destinationId: number

  @ApiProperty({
    description: 'Origin city information',
    type: CityResDto,
  })
  origin: CityResDto

  @ApiProperty({
    description: 'Destination city information',
    type: CityResDto,
  })
  destination: CityResDto

  @ApiProperty({
    description: 'Physical seat information',
    type: PhysicalSeatResDto,
  })
  physicalSeat: PhysicalSeatResDto

  @ApiProperty({
    description: 'Route sheet information',
    type: RouteSheetResDto,
  })
  routeSheet: RouteSheetResDto

  @ApiProperty({
    description: 'Payment information',
    type: PaymentResDto,
  })
  payment: PaymentResDto
}
