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
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { BusResDto } from './dto/res/bus.dto'
import { BusFiltersReqDto } from './dto/req/bus-filters.dto'

@ApiTags('Buses')
@Controller('buses')
export class BusesController {
  constructor(private readonly service: BusesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new bus',
  })
  @ApiStandardResponse()
  create(@Body() dto: CreateBusReqDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all buses',
  })
  @ApiPaginatedResponse(BusResDto)
  findAll(@Query() paginationDto: BusFiltersReqDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a bus by id',
  })
  @ApiStandardResponse(BusResDto)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a bus by id',
  })
  @ApiStandardResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBusReqDto) {
    return this.service.update(id, dto)
  }

  @Patch(':id/change-status')
  @ApiOperation({
    summary: 'Change the status of a bus by id',
  })
  @ApiStandardResponse()
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.service.changeStatus(id)
  }
}
