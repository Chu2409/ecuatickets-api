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
import { FrequenciesService } from './frequencies.service'
import { CreateFrequencyReqDto } from './dto/req/create-frequency.dto'
import { UpdateFrequencyReqDto } from './dto/req/update-frequency.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { FrequencyResDto } from './dto/res/frequency.dto'
import { FrequencyFiltersReqDto } from './dto/req/frequency-filters.dto'
import { GetCompanyId } from '../auth/decorators/get-company-id.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_ROLE } from '../users/types/user-role.enum'

@ApiTags('Frequencies (COMPANY)')
@Controller('frequencies')
@ApiBearerAuth()
@Auth(USER_ROLE.COMPANY)
export class FrequenciesController {
  constructor(private readonly service: FrequenciesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new frequency',
  })
  @ApiStandardResponse()
  create(
    @Body() dto: CreateFrequencyReqDto,
    @GetCompanyId() companyId: number,
  ) {
    dto.companyId = companyId
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all frequencies (COMPANY, CLERK)',
  })
  @Auth(USER_ROLE.COMPANY, USER_ROLE.CLERK)
  @ApiPaginatedResponse(FrequencyResDto)
  findAll(
    @Query() paginationDto: FrequencyFiltersReqDto,
    @GetCompanyId() companyId: number,
  ) {
    paginationDto.companyId = companyId
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a frequency by id (COMPANY, CLERK)',
  })
  @Auth(USER_ROLE.COMPANY, USER_ROLE.CLERK)
  @ApiStandardResponse(FrequencyResDto)
  findById(
    @Param('id', ParseIntPipe) id: number,
    @GetCompanyId() companyId: number,
  ) {
    return this.service.findOne(id, companyId)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a frequency by id',
  })
  @ApiStandardResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFrequencyReqDto,
    @GetCompanyId() companyId: number,
  ) {
    dto.companyId = companyId
    return this.service.update(id, dto)
  }

  @Patch(':id/change-status')
  @ApiOperation({
    summary: 'Change the status of a frequency by id',
  })
  @ApiStandardResponse()
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetCompanyId() companyId: number,
  ) {
    return this.service.changeStatus(id, companyId)
  }
}
