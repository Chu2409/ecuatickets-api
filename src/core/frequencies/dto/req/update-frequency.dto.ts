import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator'
import { CreateFrequencyReqDto } from './create-frequency.dto'

export class UpdateFrequencyReqDto extends PartialType(CreateFrequencyReqDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Frequency time',
    example: '08:00',
  })
  time?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Frequency resolution',
    example: '24h',
  })
  resolution?: string

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
  @IsOptional()
  @ApiProperty({
    description: 'Origin city ID',
    example: 1,
  })
  originId?: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: 'Destination city ID',
    example: 2,
  })
  destinationId?: number

  @ValidateIf(() => false)
  companyId: number
}
