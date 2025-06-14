import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class SearchRoutesDto {
  @ApiProperty({
    description: 'ID of origin city',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  originId: number

  @ApiProperty({
    description: 'ID of destination city',
    example: 2,
  })
  @IsNumber()
  @Type(() => Number)
  destinationId: number

  @ApiProperty({
    description: 'Date of travel',
    example: new Date(),
  })
  @IsDate()
  @Type(() => Date)
  date: Date
}
