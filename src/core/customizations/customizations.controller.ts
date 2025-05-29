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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger'
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Crear customización con archivo de imagen',
  })
  @ApiBody({
    description: 'Archivo de imagen y datos de customización',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, PNG, WebP)',
        },
        companyId: {
          type: 'number',
          description: 'ID de la compañía',
          example: 1,
        },
        colorId: {
          type: 'number',
          description: 'ID del color',
          example: 1,
        },
      },
      required: ['file', 'companyId', 'colorId'],
    },
  })
  @ApiStandardResponse()
  async createWithUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { companyId: string; hexcode: string },
  ) {
    const imageUrl = await this.fileUploadService.uploadImage(file)

    const dto: CreateCustomizationDto = {
      companyId: parseInt(body.companyId),
      hexCode: body.hexcode,
      imageUrl,
    }

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

  @Patch(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Actualizar customización con nuevo archivo de imagen',
  })
  @ApiBody({
    description: 'Archivo de imagen y datos opcionales',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, PNG, WebP)',
        },
        colorId: {
          type: 'number',
          description: 'ID del color (opcional)',
          example: 1,
        },
      },
      required: ['file'],
    },
  })
  @ApiStandardResponse()
  async updateWithUpload(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { colorId?: string },
  ) {
    const imageUrl = await this.fileUploadService.uploadImage(file)

    const dto: UpdateCustomizationDto = {
      imageUrl,
      ...(body.colorId && { colorId: parseInt(body.colorId) }),
    }

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
