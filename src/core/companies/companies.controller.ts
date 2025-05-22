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
import { CompaniesService } from './companies.service'
import { CreateCompanyReqDto } from './dto/req/create-company.dto'
import { UpdateCompanyReqDto } from './dto/req/update-company.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { CompanyResDto } from './dto/res/compy.dto'
import { CompanyFiltersReqDto } from './dto/req/company-filters.dto'

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly service: CompaniesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiStandardResponse()
  create(@Body() dto: CreateCompanyReqDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiPaginatedResponse(CompanyResDto)
  findAll(@Query() paginationDto: CompanyFiltersReqDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by id',
  })
  @ApiStandardResponse(CompanyResDto)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by id',
  })
  @ApiStandardResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyReqDto,
  ) {
    return this.service.update(id, dto)
  }

  @Patch(':id/change-status')
  @ApiOperation({
    summary: 'Change the status of a user by id',
  })
  @ApiStandardResponse()
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.service.changeStatus(id)
  }
}
