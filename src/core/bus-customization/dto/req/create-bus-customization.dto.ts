import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, Min, Max, IsNotEmpty } from 'class-validator'

export class CreateBusCustomizationReqDto {
  @ApiProperty({
    description: 'ID of the seat type to add',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  seatTypeId: number

  @ApiProperty({
    description: 'Number of seats to add',
    example: 20,
  })
  
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number

  @ApiProperty({
    description: 'Floor level (1 for ground floor, 2 for upper floor)',
    example: 1,
    minimum: 1,
    maximum: 2,
  })
  @IsInt()
  @Min(1)
  @Max(2)
  floor: number

}
