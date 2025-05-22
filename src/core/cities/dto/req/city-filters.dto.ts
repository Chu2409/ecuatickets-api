import { IsOptional, IsString } from 'class-validator'
import { BaseParamsReqDto } from 'src/common/dtos/req/base-params.dto'

export class CityFiltersReqDto extends BaseParamsReqDto {
  @IsOptional()
  @IsString()
  search?: string
}
