import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ApiPaginatedResponse,
  ApiStandardResponse,
} from 'src/common/decorators/api-standard-response.decorator'
import { CreateCustomizationDto } from './dto/req/create-customization.dto'
import { CompanyCustomizationResDto } from './dto/res/customization.dto'
import { UpdateCustomizationDto } from './dto/req/update-customization.dto'
import { CustomizationFiltersDto } from './dto/req/customization-filters.dto'
import { FileUploadService } from 'src/common/utils/file-upload'
import { CustomizationsService } from './customizations.service'

@ApiTags('Company Customizations')
@Controller('company-customizations')
export class CustomizationsController {
  constructor(
    private readonly service: CustomizationsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva customización de compañía',
  })
  @ApiStandardResponse()
  create(@Body() dto: CreateCustomizationDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las customizaciones',
  })
  @ApiPaginatedResponse(CompanyCustomizationResDto)
  findAll(@Query() filters: CustomizationFiltersDto) {
    return this.service.findAll(filters)
  }

  @Get('company/:companyId')
  @ApiOperation({
    summary: 'Obtener customización por ID de compañía',
  })
  @ApiStandardResponse(CompanyCustomizationResDto)
  findByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.service.findByCompanyId(companyId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una customización por ID',
  })
  @ApiStandardResponse(CompanyCustomizationResDto)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una customización por ID',
  })
  @ApiStandardResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomizationDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una customización por ID',
  })
  @ApiStandardResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
