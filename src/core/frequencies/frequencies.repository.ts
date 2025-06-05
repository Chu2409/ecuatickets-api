import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { FrequencyFiltersReqDto } from './dto/req/frequency-filters.dto'
import { FrequencyResDto } from './dto/res/frequency.dto'
import { Prisma } from '@prisma/client'
import { take } from 'rxjs'
import { CreateFrequencyReqDto } from './dto/req/create-frequency.dto'
import { UpdateFrequencyReqDto } from './dto/req/update-frequency.dto'

@Injectable()
export class FrequenciesRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async findMany(
    filters: FrequencyFiltersReqDto,
  ): Promise<[FrequencyResDto[], number]> {
    const { limit, page, search } = filters

    const whereClause: Prisma.FrequencyWhereInput = {}

    if (search) {
      whereClause.OR = [
        {
          resolution: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }

    const [entities, total] = await Promise.all([
      this.dbService.frequency.findMany({
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
      this.dbService.frequency.count({
        where: whereClause,
      }),
    ])

    return [entities, total]
  }

  async findById(id: number) {
    return this.dbService.frequency.findUnique({
      where: { id },
    })
  }

  async create(data: CreateFrequencyReqDto) {
    return this.dbService.frequency.create({
      data: {
        ...data,
      },
    })
  }

  async update(id: number, data: UpdateFrequencyReqDto) {
    return this.dbService.frequency.update({
      where: { id },
      data: {
        ...data,
      },
    })
  }

  async verifyIfExists({
    resolution,
    excludeId,
  }: {
    resolution: string
    excludeId?: number
  }) {
    const conditions: Prisma.FrequencyWhereInput = {
      OR: [],
      NOT: {},
    }

    if (resolution) {
      conditions.OR?.push({ resolution })
    }

    if (excludeId) {
      conditions.NOT = { id: excludeId }
    }

    return this.dbService.frequency.findFirst({
      where: conditions,
    })

  }

  async remove(id: number) {
    return this.dbService.frequency.delete({
      where: { id },
    })
  }

  async changeStatus(
    id: number, active: boolean){
    return this.dbService.frequency.update({
      where: { id },
      data: {
        active,
      },    
    })
    }
}
