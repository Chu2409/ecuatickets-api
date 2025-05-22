import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { CityFiltersReqDto } from './dto/req/city-filters.dto'
import { CityResDto } from './dto/res/city.dto'
import { Prisma } from '@prisma/client'
import { CreateCityReqDto } from './dto/req/create-city.dto'
import { UpdateCityReqDto } from './dto/req/update-city.dto'

@Injectable()
export class CitiesRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async findMany(filters: CityFiltersReqDto): Promise<[CityResDto[], number]> {
    const { limit, page, search } = filters

    const whereClause: Prisma.CityWhereInput = {}

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

    const [entities, total] = await Promise.all([
      this.dbService.city.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        orderBy: {
          id: 'desc',
        },
      }),
      this.dbService.city.count({
        where: whereClause,
      }),
    ])

    return [entities, total]
  }

  async findById(id: number) {
    return this.dbService.city.findUnique({
      where: { id },
    })
  }

  async create(data: CreateCityReqDto) {
    return this.dbService.city.create({
      data: {
        ...data,
      },
    })
  }

  async update(id: number, data: UpdateCityReqDto) {
    return this.dbService.city.update({
      where: { id },
      data: {
        ...data,
      },
    })
  }

  async verifyIfExists({
    name,
    province,
    excludeId,
  }: {
    name: string
    province: string
    excludeId?: number
  }) {
    const conditions: Prisma.CityWhereInput = {
      OR: [],
      NOT: {},
    }

    if (name) {
      conditions.OR?.push({ name })
    }

    if (province) {
      conditions.OR?.push({ province })
    }

    if (excludeId) {
      conditions.NOT = { id: excludeId }
    }

    return this.dbService.city.findFirst({
      where: conditions,
    })
  }

  async remove(id: number) {
    return this.dbService.city.delete({
      where: { id },
    })
  }
}
