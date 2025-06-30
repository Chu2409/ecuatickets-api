import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TemplateSeatsRepository } from './template-seats.repository';
import { CreateSeatTemplateDto } from './dto/req/create-seat-template.dto';
import { UpdateSeatTemplateDto } from './dto/req/update-seat-template.dto';
import { SeatTemplateFiltersDto } from './dto/req/seat-template-filters.dto';
import { SeatTemplateDto } from './dto/res/seat-template.dto';
import { TemplateSeatDto } from './dto/res/template-seat.dto';
import { SeatTemplateHeaderDto } from './dto/res/seat-template-header.dto';

@Injectable()
export class TemplateSeatsService {
  constructor(private readonly templateSeatsRepository: TemplateSeatsRepository) {}

  async findAll(filters?: SeatTemplateFiltersDto): Promise<SeatTemplateDto[]> {
    const templates = await this.templateSeatsRepository.findAll(filters);
    return templates.map(template => this.mapToDto(template));
  }

  async findById(id: number): Promise<SeatTemplateDto> {
    const template = await this.templateSeatsRepository.findById(id);
    if (!template) {
      throw new NotFoundException(`Plantilla de asientos con ID ${id} no encontrada`);
    }
    return this.mapToDto(template);
  }

  async create(createSeatTemplateDto: CreateSeatTemplateDto): Promise<SeatTemplateDto> {
    // Validar que el número total de asientos coincida con la configuración
    this.validateSeatConfiguration(createSeatTemplateDto);
    
    // Validar que no haya asientos duplicados
    this.validateUniqueSeats(createSeatTemplateDto.templateSeats);

    const template = await this.templateSeatsRepository.create(createSeatTemplateDto);
    return this.mapToDto(template);
  }

  async update(id: number, updateSeatTemplateDto: UpdateSeatTemplateDto): Promise<SeatTemplateDto> {
    const existingTemplate = await this.templateSeatsRepository.findById(id);
    if (!existingTemplate) {
      throw new NotFoundException(`Plantilla de asientos con ID ${id} no encontrada`);
    }

    // Si se están actualizando los asientos, validar la configuración
    if (updateSeatTemplateDto.templateSeats) {
      const templateData = {
        ...existingTemplate,
        ...updateSeatTemplateDto,
      };
      this.validateSeatConfiguration(templateData);
      this.validateUniqueSeats(updateSeatTemplateDto.templateSeats);
    }

    const template = await this.templateSeatsRepository.update(id, updateSeatTemplateDto);
    return this.mapToDto(template);
  }

  async delete(id: number): Promise<void> {
    const template = await this.templateSeatsRepository.findById(id);
    if (!template) {
      throw new NotFoundException(`Plantilla de asientos con ID ${id} no encontrada`);
    }

    await this.templateSeatsRepository.delete(id);
  }

  async findActiveTemplates(): Promise<SeatTemplateDto[]> {
    const templates = await this.templateSeatsRepository.findActiveTemplates();
    return templates.map(template => this.mapToDto(template));
  }

  async findAllHeaders(): Promise<SeatTemplateHeaderDto[]> {
    const templates = await this.templateSeatsRepository.findAll();
    return templates.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description ?? undefined,
      totalSeats: t.totalSeats,
      rows: t.rows,
      columns: t.columns,
      floors: t.floors,
      isActive: t.isActive,
      createdAt: t.createdAt,
    }));
  }

  private validateSeatConfiguration(template: any): void {
    const { totalSeats, rows, columns, floors = 1, templateSeats } = template;
    
    // Calcular el número máximo de asientos posibles
    const maxSeats = rows * columns * floors;
    
    if (totalSeats > maxSeats) {
      throw new BadRequestException(
        `El número total de asientos (${totalSeats}) excede la capacidad máxima (${maxSeats}) para ${rows} filas, ${columns} columnas y ${floors} pisos`
      );
    }

    if (templateSeats) {
      const actualSeats = templateSeats.filter(seat => !seat.isAisle).length;
      if (actualSeats !== totalSeats) {
        throw new BadRequestException(
          `El número de asientos en la plantilla (${actualSeats}) no coincide con el total especificado (${totalSeats})`
        );
      }
    }
  }

  private validateUniqueSeats(templateSeats: any[]): void {
    const seatNumbers = templateSeats.map(seat => seat.seatNumber);
    const uniqueSeatNumbers = new Set(seatNumbers);
    
    if (seatNumbers.length !== uniqueSeatNumbers.size) {
      throw new BadRequestException('Hay números de asiento duplicados en la plantilla');
    }

    // Validar que no haya posiciones duplicadas
    const positions = templateSeats.map(seat => `${seat.row}-${seat.column}-${seat.floor || 1}`);
    const uniquePositions = new Set(positions);
    
    if (positions.length !== uniquePositions.size) {
      throw new BadRequestException('Hay posiciones duplicadas en la plantilla');
    }
  }

  private mapToDto(template: any): SeatTemplateDto {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      totalSeats: template.totalSeats,
      rows: template.rows,
      columns: template.columns,
      floors: template.floors,
      isActive: template.isActive,
      createdAt: template.createdAt,
      templateSeats: template.templateSeats?.map(seat => ({
        id: seat.id,
        seatNumber: seat.seatNumber,
        row: seat.row,
        column: seat.column,
        floor: seat.floor,
        isAisle: seat.isAisle,
        templateId: seat.templateId,
      })) || [],
    };
  }
} 