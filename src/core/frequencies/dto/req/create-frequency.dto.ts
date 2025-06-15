import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsPositive,
  ValidateIf,
} from 'class-validator'

export class CreateFrequencyReqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Frequency time',
    example: '08:00',
  })
  time: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Frequency resolution',
    example: '24h',
  })
  resolution: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Is the frequency active?',
    example: true,
    default: true,
  })
  active?: boolean

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Origin city ID',
    example: 1,
  })
  originId: number

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Destination city ID',
    example: 2,
  })
  destinationId: number

  @ValidateIf(() => false)
  companyId: number
}