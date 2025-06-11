import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator'
import { PassengerType } from '@prisma/client'

export class PassengerInfoDto {
  @ApiProperty({ description: 'Identificación del pasajero (cédula)' })
  @IsNotEmpty()
  @IsString()
  passengerId: string

  @ApiProperty({ description: 'Nombre completo del pasajero' })
  @IsNotEmpty()
  @IsString()
  passengerName: string

  @ApiProperty({ enum: PassengerType, description: 'Tipo de pasajero' })
  @IsEnum(PassengerType)
  passengerType: PassengerType

  @ApiProperty({ description: 'ID del asiento físico seleccionado' })
  @IsNumber()
  physicalSeatId: number
}
