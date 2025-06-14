import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsEmail,
  IsOptional,
  IsDate,
  ValidateIf,
} from 'class-validator'
import { PASSENGER_TYPE } from '../../types/passenger-type'
import { Type } from 'class-transformer'

export class TicketInfoDtoReq {
  @ApiProperty({
    description: 'ID of the frequency segment price',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  frecuencySegmentPriceId: number

  @ApiProperty({
    description: 'Date of the ticket',
    example: new Date(),
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date

  @ApiProperty({
    description: 'ID of the physical seat',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  physicalSeatId: number

  @ApiProperty({
    description: 'Type of passenger',
    enum: PASSENGER_TYPE,
    example: PASSENGER_TYPE.NORMAL,
  })
  @IsEnum(PASSENGER_TYPE)
  @IsNotEmpty()
  passengerType: PASSENGER_TYPE

  @ApiProperty({
    description: 'ID of the passenger',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  passengerId?: number

  @ApiProperty({
    description: 'Passenger DNI',
    example: '1234567890',
  })
  @ValidateIf((o) => !o.passengerId)
  @IsString()
  @IsNotEmpty()
  passsengerDni: string

  @ApiProperty({
    description: 'Passenger name',
    example: 'John',
  })
  @ValidateIf((o) => !o.passengerId)
  @IsString()
  @IsNotEmpty()
  passengerName: string

  @ApiProperty({
    description: 'Passenger surname',
    example: 'Doe',
  })
  @ValidateIf((o) => !o.passengerId)
  @IsString()
  @IsNotEmpty()
  passengerSurname: string

  @ApiProperty({
    description: 'Passenger email',
    example: 'john.doe@example.com',
    required: false,
  })
  @ValidateIf((o) => !o.passengerId)
  @IsEmail()
  @IsOptional()
  passengerEmail?: string

  @ApiProperty({
    description: 'Passenger birth date',
    example: '1990-01-01',
  })
  @ValidateIf((o) => !o.passengerId)
  @IsDate()
  @Type(() => Date)
  passengerBirthDate: Date
}
