import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { BusesService } from './buses.service'
import { CreateBusReqDto } from './dto/req/create-bus.dto'
import { UpdateBusReqDto } from './dto/req/update-bus.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { BusResDto } from './dto/res/bus.dto'
import { BusFiltersReqDto } from './dto/req/bus-filters.dto'
import { GetCompanyId } from '../auth/decorators/get-company-id.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_ROLE } from '../users/types/user-role.enum'

@ApiTags('Buses (COMPANY)')
@Controller('buses')
@ApiBearerAuth()
@Auth(USER_ROLE.COMPANY)
export class BusesController {
  constructor(private readonly service: BusesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new bus',
  })
  @ApiStandardResponse()
  create(@Body() dto: CreateBusReqDto, @GetCompanyId() companyId: number) {
    dto.companyId = companyId
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all buses (COMPANY, CLERK)',
  })
  @Auth(USER_ROLE.COMPANY, USER_ROLE.CLERK)
  @ApiPaginatedResponse(BusResDto)
  findAll(
    @Query() paginationDto: BusFiltersReqDto,
    @GetCompanyId() companyId: number,
  ) {
    paginationDto.companyId = companyId
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a bus by id (COMPANY, CLERK)',
  })
  @Auth(USER_ROLE.COMPANY, USER_ROLE.CLERK)
  @ApiStandardResponse(BusResDto)
  findById(
    @Param('id', ParseIntPipe) id: number,
    @GetCompanyId() companyId: number,
  ) {
    return this.service.findOne(id, companyId)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a bus by id',
  })
  @ApiStandardResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBusReqDto,
    @GetCompanyId() companyId: number,
  ) {
    dto.companyId = companyId
    return this.service.update(id, dto)
  }

  @Patch(':id/change-status')
  @ApiOperation({
    summary: 'Change the status of a bus by id',
  })
  @ApiStandardResponse()
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetCompanyId() companyId: number,
  ) {
    return this.service.changeStatus(id, companyId)
  }
}
