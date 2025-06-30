import { Injectable } from '@nestjs/common';
import { SeatTemplateFiltersDto } from './dto/req/seat-template-filters.dto';
import { CreateSeatTemplateDto } from './dto/req/create-seat-template.dto';
import { UpdateSeatTemplateDto } from './dto/req/update-seat-template.dto';
import { DatabaseService } from 'src/global/database/database.service';

@Injectable()
export class TemplateSeatsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAll(filters?: SeatTemplateFiltersDto) {
    const where: any = {};

    if (filters?.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.minSeats || filters?.maxSeats) {
      where.totalSeats = {};
      if (filters.minSeats) {
        where.totalSeats.gte = filters.minSeats;
      }
      if (filters.maxSeats) {
        where.totalSeats.lte = filters.maxSeats;
      }
    }

    return this.db.seatTemplate.findMany({
      where,
      include: {
        templateSeats: {
          orderBy: [
            { floor: 'asc' },
            { row: 'asc' },
            { column: 'asc' },
          ],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number) {
    return this.db.seatTemplate.findUnique({
      where: { id },
      include: {
        templateSeats: {
          orderBy: [
            { floor: 'asc' },
            { row: 'asc' },
            { column: 'asc' },
          ],
        },
      },
    });
  }

  async create(createSeatTemplateDto: CreateSeatTemplateDto) {
    const { templateSeats, ...templateData } = createSeatTemplateDto;

    return this.db.seatTemplate.create({
      data: {
        ...templateData,
        templateSeats: {
          create: templateSeats,
        },
      },
      include: {
        templateSeats: {
          orderBy: [
            { floor: 'asc' },
            { row: 'asc' },
            { column: 'asc' },
          ],
        },
      },
    });
  }

  async update(id: number, updateSeatTemplateDto: UpdateSeatTemplateDto) {
    const { templateSeats, ...templateData } = updateSeatTemplateDto;

    // Si se proporcionan nuevos asientos de plantilla, eliminar los existentes y crear los nuevos
    if (templateSeats) {
      return this.db.seatTemplate.update({
        where: { id },
        data: {
          ...templateData,
          templateSeats: {
            deleteMany: {},
            create: templateSeats,
          },
        },
        include: {
          templateSeats: {
            orderBy: [
              { floor: 'asc' },
              { row: 'asc' },
              { column: 'asc' },
            ],
          },
        },
      });
    }

    // Si no se proporcionan nuevos asientos, solo actualizar los datos de la plantilla
    return this.db.seatTemplate.update({
      where: { id },
      data: templateData,
      include: {
        templateSeats: {
          orderBy: [
            { floor: 'asc' },
            { row: 'asc' },
            { column: 'asc' },
          ],
        },
      },
    });
  }

  async delete(id: number) {
    return this.db.seatTemplate.delete({
      where: { id },
    });
  }

  async findActiveTemplates() {
    return this.db.seatTemplate.findMany({
      where: { isActive: true },
      include: {
        templateSeats: {
          orderBy: [
            { floor: 'asc' },
            { row: 'asc' },
            { column: 'asc' },
          ],
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
} 