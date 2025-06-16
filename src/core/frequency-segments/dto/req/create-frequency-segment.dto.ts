import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateFrequencySegmentReqDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The price of the frequency segment',
    example: 5,
  })
  price: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The originId of the frequency segment',
    example: 1,
  })
  originId: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The destinationId of the frequency segment',
    example: 2,
  })
  destinationId: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The frequencyId of the frequency segment',
    example: 1,
  })
  frequencyId: number
}
