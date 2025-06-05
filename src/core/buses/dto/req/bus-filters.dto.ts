import { IsOptional, IsString, ValidateIf } from 'class-validator'
import { BaseParamsReqDto } from 'src/common/dtos/req/base-params.dto'

export class BusFiltersReqDto extends BaseParamsReqDto {
  @IsOptional()
  @IsString()
  search?: string

  @ValidateIf(() => false)
  companyId: number
}
