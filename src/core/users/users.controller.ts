import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserReqDto } from './dto/req/create-user.dto'
import { UpdateUserReqDto } from './dto/req/update-user.dto'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { BaseUserResDto } from './dto/res/user.dto'
import { UserFiltersReqDto } from './dto/req/user-filters.dto'
import { USER_ROLE } from './types/user-role.enum'
import { Auth } from '../auth/decorators/auth.decorator'
import { GetCompanyId } from '../auth/decorators/get-company-id.decorator'

@ApiTags('Users (ADMIN)')
@Controller('users')
@ApiBearerAuth()
@Auth(USER_ROLE.ADMIN)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiStandardResponse()
  @Auth(USER_ROLE.COMPANY)
  create(@Body() dto: CreateUserReqDto, @GetCompanyId() companyId: number) {
    dto.companyId = companyId
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiPaginatedResponse(BaseUserResDto, HttpStatus.OK)
  findAll(@Query() paginationDto: UserFiltersReqDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by id',
  })
  @ApiStandardResponse(BaseUserResDto, HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by id',
  })
  @ApiStandardResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserReqDto) {
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
