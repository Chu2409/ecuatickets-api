import { Controller, Get, Post, Body, Patch } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { CreateCustomizationDto } from './dto/req/create-customization.dto'
import { CompanyCustomizationResDto } from './dto/res/customization.dto'
import { UpdateCustomizationDto } from './dto/req/update-customization.dto'
import { CustomizationsService } from './customizations.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_ROLE } from '../users/types/user-role.enum'
import { GetCompanyId } from '../auth/decorators/get-company-id.decorator'

@ApiTags('Company Customizations (COMPANY)')
@Controller('company-customizations')
@ApiBearerAuth()
@Auth(USER_ROLE.COMPANY)
export class CustomizationsController {
  constructor(private readonly service: CustomizationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new company customization',
  })
  @ApiStandardResponse(Boolean)
  create(
    @Body() dto: CreateCustomizationDto,
    @GetCompanyId() companyId: number,
  ) {
    dto.companyId = companyId
    return this.service.create(dto)
  }

  @Get('company')
  @ApiOperation({
    summary: 'Get company customization by company id',
  })
  @ApiStandardResponse(CompanyCustomizationResDto)
  findByCompanyId(@GetCompanyId() companyId: number) {
    return this.service.findByCompanyId(companyId)
  }

  @Patch()
  @ApiOperation({
    summary: 'Update company customization',
  })
  @ApiStandardResponse()
  update(
    @Body() dto: UpdateCustomizationDto,
    @GetCompanyId() companyId: number,
  ) {
    dto.companyId = companyId
    return this.service.update(dto)
  }
}
