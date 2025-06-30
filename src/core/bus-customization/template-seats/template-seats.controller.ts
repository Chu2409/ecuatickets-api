import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TemplateSeatsService } from './template-seats.service';
import { CreateSeatTemplateDto } from './dto/req/create-seat-template.dto';
import { UpdateSeatTemplateDto } from './dto/req/update-seat-template.dto';
import { SeatTemplateFiltersDto } from './dto/req/seat-template-filters.dto';
import { SeatTemplateDto } from './dto/res/seat-template.dto';
import { SeatTemplateHeaderDto } from './dto/res/seat-template-header.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RoleAuthGuard } from '../../auth/guards/role-auth.guard';
import { RoleProtected } from '../../auth/decorators/role-protected.decorator';
import { USER_ROLE } from 'src/core/users/types/user-role.enum';
import { ApiStandardResponse } from '../../../common/decorators/api-standard-response.decorator';

@ApiTags('template-seats')
@Controller('template-seats')
@UseGuards(RoleAuthGuard)
export class TemplateSeatsController {
  constructor(private readonly templateSeatsService: TemplateSeatsService) {}

  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las plantillas (solo información general, sin asientos)' })
  @ApiResponse({ status: 200, description: 'Lista de plantillas obtenida exitosamente' })
  @ApiStandardResponse<SeatTemplateHeaderDto[]>()
  async getAllTemplates(): Promise<SeatTemplateHeaderDto[]> {
    return this.templateSeatsService.findAllHeaders();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener plantillas de asientos activas' })
  @ApiResponse({ status: 200, description: 'Lista de plantillas activas obtenida exitosamente' })
  @ApiStandardResponse<SeatTemplateDto[]>()
  async findActiveTemplates(): Promise<SeatTemplateDto[]> {
    return this.templateSeatsService.findActiveTemplates();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una plantilla de asientos por ID' })
  @ApiResponse({ status: 200, description: 'Plantilla obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  @ApiStandardResponse<SeatTemplateDto>()
  async findById(@Param('id', ParseIntPipe) id: number): Promise<SeatTemplateDto> {
    return this.templateSeatsService.findById(id);
  }

  @Post()
  @RoleProtected(USER_ROLE.COMPANY, USER_ROLE.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva plantilla de asientos' })
  @ApiResponse({ status: 201, description: 'Plantilla creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiStandardResponse<SeatTemplateDto>()
  async create(@Body() createSeatTemplateDto: CreateSeatTemplateDto): Promise<SeatTemplateDto> {
    return this.templateSeatsService.create(createSeatTemplateDto);
  }

  @Put(':id')
  @RoleProtected(USER_ROLE.COMPANY, USER_ROLE.ADMIN)
  @ApiOperation({ summary: 'Actualizar una plantilla de asientos' })
  @ApiResponse({ status: 200, description: 'Plantilla actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiStandardResponse<SeatTemplateDto>()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeatTemplateDto: UpdateSeatTemplateDto,
  ): Promise<SeatTemplateDto> {
    return this.templateSeatsService.update(id, updateSeatTemplateDto);
  }

  @Delete(':id')
  @RoleProtected(USER_ROLE.COMPANY, USER_ROLE.ADMIN)
  @ApiOperation({ summary: 'Eliminar una plantilla de asientos' })
  @ApiResponse({ status: 200, description: 'Plantilla eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  @ApiStandardResponse<void>()
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.templateSeatsService.delete(id);
  }
} 