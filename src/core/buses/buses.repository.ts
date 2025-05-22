import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { BusFiltersReqDto } from './dto/req/bus-filters.dto'
import { BusResDto } from './dto/res/bus.dto'
import { Prisma } from '@prisma/client'
import { CreateBusReqDto } from './dto/req/create-bus.dto'
import { UpdateBusReqDto } from './dto/req/update-bus.dto'

@Injectable()
export class BusesRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async findMany(filters: BusFiltersReqDto): Promise<[BusResDto[], number]> {
    const { limit, page, search } = filters

    const whereClause: Prisma.BusWhereInput = {}

    if (search) {
      whereClause.OR = [
        {
          licensePlate: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }

    const [entities, total] = await Promise.all([
      this.dbService.bus.findMany({
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
      this.dbService.bus.count({
        where: whereClause,
      }),
    ])

    return [entities, total]
  }

  async findById(id: number) {
    return this.dbService.bus.findUnique({
      where: { id },
    })
  }

  async create(data: CreateBusReqDto) {
    return this.dbService.bus.create({
      data: {
        ...data,
      },
    })
  }

  async update(id: number, data: UpdateBusReqDto) {
    return this.dbService.bus.update({
      where: { id },
      data: {
        ...data,
      },
    })
  }

  async verifyIfExists({
    licensePlate,
    excludeId,
  }: {
    licensePlate: string
    excludeId?: number
  }) {
    const conditions: Prisma.BusWhereInput = {
      OR: [],
      NOT: {},
    }

    if (licensePlate) {
      conditions.OR?.push({ licensePlate })
    }

    if (excludeId) {
      conditions.NOT = { id: excludeId }
    }

    return this.dbService.bus.findFirst({
      where: conditions,
    })
  }

  async remove(id: number) {
    return this.dbService.bus.delete({
      where: { id },
    })
  }

  async changeStatus(id: number, isActive: boolean) {
    return this.dbService.bus.update({
      where: { id },
      data: {
        isActive,
      },
    })
  }
}
