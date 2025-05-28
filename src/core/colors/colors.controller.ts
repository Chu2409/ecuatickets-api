import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { ColorsService } from './colors.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { ColorResDto } from './dto/res/color.dto'
import { CreateColorDto } from './dto/req/create-color.dto'
import { UpdateColorDto } from './dto/req/update-color.dto'

@ApiTags('Colors')
@Controller('colors')
export class ColorsController {
  constructor(private readonly service: ColorsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo color',
  })
  @ApiStandardResponse()
  create(@Body() dto: CreateColorDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los colores disponibles',
  })
  @ApiStandardResponse(ColorResDto)
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un color por ID',
  })
  @ApiStandardResponse(ColorResDto)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un color por ID',
  })
  @ApiStandardResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateColorDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un color por ID',
  })
  @ApiStandardResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
