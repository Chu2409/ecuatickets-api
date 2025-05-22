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
import { CitiesService } from './cities.service'
import { CreateCityReqDto } from './dto/req/create-city.dto'
import { UpdateCityReqDto } from './dto/req/update-city.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { CityResDto } from './dto/res/city.dto'
import { CityFiltersReqDto } from './dto/req/city-filters.dto'

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly service: CitiesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new city',
  })
  @ApiStandardResponse()
  create(@Body() dto: CreateCityReqDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all cities',
  })
  @ApiPaginatedResponse(CityResDto)
  findAll(@Query() paginationDto: CityFiltersReqDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a city by id',
  })
  @ApiStandardResponse(CityResDto)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a city by id',
  })
  @ApiStandardResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCityReqDto) {
    return this.service.update(id, dto)
  }
}
