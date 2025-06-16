import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class UpdateFrequencySegmentReqDto {
  @IsNumber()
  @ApiPropertyOptional({
    description: 'The price of the frequency segment',
    example: 5,
  })
  price?: number

  @IsNumber()
  @ApiPropertyOptional({
    description: 'The originId of the frequency segment',
    example: 1,
  })
  originId?: number

  @IsNumber()
  @ApiPropertyOptional({
    description: 'The destinationId of the frequency segment',
    example: 2,
  })
  destinationId?: number

  @IsNumber()
  @ApiPropertyOptional({
    description: 'The frequencyId of the frequency segment',
    example: 1,
  })
  frequencyId?: number
}
