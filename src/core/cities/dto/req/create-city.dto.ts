import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCityReqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'City name',
    example: 'Machala',
  })
  name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Province name',
    example: 'El Oro',
  })
  province: string
}
