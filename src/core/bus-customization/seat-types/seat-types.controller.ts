import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Auth } from "src/core/auth/decorators/auth.decorator";
import { USER_ROLE } from "src/core/users/types/user-role.enum";
import { SeatTypesService } from "./seat-types.service";
import { ApiPaginatedResponse, ApiStandardResponse } from "src/common/decorators/api-standard-response.decorator";
import { SeatTypeResDto } from "./dto/res/seat-type.dto";
import { CreateSeatTypeReqDto } from "./dto/req/create-seat-type.dto";
import { GetCompanyId } from "src/core/auth/decorators/get-company-id.decorator";
import { SeatTypeFilterReqDto } from "./dto/req/seat-type.filters";
import { UpdateSeatTypeReqDto } from "./dto/req/update-seat-type.dto";


@ApiTags("Seat Types (COMPANY)")
@Controller("seat-types")
@ApiBearerAuth()
@Auth(USER_ROLE.COMPANY)

export class SeatTypesController {

    constructor(private readonly service: SeatTypesService) {}

    @Post()
    @ApiOperation({
        summary: "Create a new seat type",
        })
    @ApiStandardResponse()
    create(@Body() dto: CreateSeatTypeReqDto, @GetCompanyId() companyId: number) {
        dto.companyId = companyId;
        return this.service.create(dto);

    }

    @Get()
    @ApiOperation({
        summary: "Get all seat types",
    })
    @Auth(USER_ROLE.COMPANY, USER_ROLE.CLERK)
    @ApiPaginatedResponse(SeatTypeResDto)
    findAll(
        @Query() paginatioDto: SeatTypeFilterReqDto,
        @GetCompanyId() companyId: number
    ){
        paginatioDto.companyId = companyId;
        return this.service.findAll(paginatioDto);
    }


    @Get(':id')
    @ApiOperation({
        summary: "Get a seat type by id",
    })
    @Auth(USER_ROLE.COMPANY, USER_ROLE.CLERK)
    @ApiStandardResponse(SeatTypeResDto)
    findById(
        @Param('id', new ParseIntPipe) id: number,
        @GetCompanyId() companyId: number){
            return this.service.findOne(id, companyId);
        }
    
    @Patch(':id')
    @ApiOperation({
        summary: "Update a seat type by id",
    })
    @ApiStandardResponse()
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSeatTypeReqDto,
        @GetCompanyId() companyId: number
    ) {
        dto.companyId = companyId;
        return this.service.update(id, dto);
    }
}