import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { SeatTypeFilterReqDto } from './dto/req/seat-type.filters'
import { Prisma } from '@prisma/client'
import { SeatTypeResDto } from './dto/res/seat-type.dto'
import { CreateSeatTypeReqDto } from './dto/req/create-seat-type.dto'
import { UpdateSeatTypeReqDto } from './dto/req/update-seat-type.dto'

@Injectable()
export class SeatTypesRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async findMany(
    filters: SeatTypeFilterReqDto,
  ): Promise<[SeatTypeResDto[], number]> {
    const { limit, page, search, companyId } = filters

    const whereClause: Prisma.SeatTypeWhereInput = {
      companyId: companyId ?? undefined,
    }

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }

    const [rawEntities, total] = await Promise.all([
      this.dbService.seatType.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        orderBy: {
          id: 'desc',
        },
        omit: {
          companyId: true,
        },
      }),
      this.dbService.seatType.count({
        where: whereClause,
      }),
    ])

    const entities = rawEntities.map((entity) => ({
      ...entity,
      description: entity.description ?? undefined,
    }))

    return [entities, total]
  }

  async findById(id: number, companyId: number) {
    return this.dbService.seatType.findUnique({
      where: { id, companyId },
    })
  }

  async create(data: CreateSeatTypeReqDto) {
    return this.dbService.seatType.create({
      data: {
        ...data,
      },
    })
  }

  async update(id: number, data: UpdateSeatTypeReqDto) {
    return this.dbService.seatType.update({
      where: { id },
      data: {
        ...data,
      },
    })
  }

  async verifyIfExists({
    name,
    excludeId,
  }: {
    name: string
    excludeId?: number
  }) {
    const conditions: Prisma.SeatTypeWhereInput = {
      OR: [],
      NOT: {},
    }
    if (name) {
      conditions.OR?.push({ name })
    }
    if (excludeId) {
      conditions.NOT = { id: excludeId }
    }

    return this.dbService.seatType.findFirst({
      where: conditions,
    })
  }

  async remove(id: number) {
    return this.dbService.seatType.delete({
      where: { id },
    })
  }
}
