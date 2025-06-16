import { IsOptional, IsString, ValidateIf } from "class-validator";
import { BaseParamsReqDto } from "src/common/dtos/req/base-params.dto";


export class SeatTypeFilterReqDto extends BaseParamsReqDto {

    @IsString()
    @IsOptional()
    search?: string;

    @ValidateIf(() => false)
    companyId: number;

}