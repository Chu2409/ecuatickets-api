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
import { PassengerType } from '@prisma/client'

export class TicketInfoDtoReq {
  @ApiProperty({
    description: 'ID del pasajero (opcional). Si no se proporciona, se creará un nuevo pasajero',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  passengerId?: number

  @ApiProperty({
    description: 'DNI del pasajero. Si el pasajero ya existe, se usará su información',
    example: '1234567890',
  })
  @IsString()
  passsengerDni: string

  @ApiProperty({
    description: 'Nombre del pasajero',
    example: 'John',
  })
  @IsString()
  passengerName: string

  @ApiProperty({
    description: 'Apellido del pasajero',
    example: 'Doe',
  })
  @IsString()
  passengerSurname: string

  @ApiProperty({
    description: 'Email del pasajero',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  passengerEmail?: string

  @ApiProperty({
    description: 'Fecha de nacimiento del pasajero',
    example: '1990-01-01',
  })
  @Type(() => Date)
  @IsDate()
  passengerBirthDate: Date

  @ApiProperty({
    description: 'Tipo de pasajero',
    enum: PassengerType,
    example: PassengerType.NORMAL,
  })
  @IsEnum(PassengerType)
  passengerType: PassengerType

  @ApiProperty({
    description: 'ID del precio del segmento de frecuencia',
    example: 1,
  })
  @IsNumber()
  frecuencySegmentPriceId: number

  @ApiProperty({
    description: 'Fecha del viaje',
    example: '2025-06-16T08:35:01.403Z',
  })
  @Type(() => Date)
  @IsDate()
  date: Date

  @ApiProperty({
    description: 'ID del asiento físico',
    example: 1,
  })
  @IsNumber()
  physicalSeatId: number
}
