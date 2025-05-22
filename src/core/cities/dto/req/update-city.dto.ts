import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { CreateCityReqDto } from './create-city.dto'
import { IsOptional, IsString } from 'class-validator'

export class UpdateCityReqDto extends PartialType(CreateCityReqDto) {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'City name',
    example: 'Machala',
  })
  name: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Province name',
    example: 'El Oro',
  })
  province: string
}
