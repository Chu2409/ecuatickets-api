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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { CityResDto } from './dto/res/city.dto'
import { CityFiltersReqDto } from './dto/req/city-filters.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_ROLE } from '../users/types/user-role.enum'

@ApiTags('Cities (ADMIN)')
@Controller('cities')
@ApiBearerAuth()
@Auth(USER_ROLE.ADMIN)
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
    summary: 'Get all cities (ADMIN, CLERK, COMPANY)',
  })
  @ApiPaginatedResponse(CityResDto)
  @Auth(USER_ROLE.ADMIN, USER_ROLE.CLERK, USER_ROLE.COMPANY)
  findAll(@Query() paginationDto: CityFiltersReqDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a city by id (ADMIN, CLERK, COMPANY)',
  })
  @ApiStandardResponse(CityResDto)
  @Auth(USER_ROLE.ADMIN, USER_ROLE.CLERK, USER_ROLE.COMPANY)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a city by id (ADMIN, CLERK, COMPANY)',
  })
  @ApiStandardResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCityReqDto) {
    return this.service.update(id, dto)
  }
}
