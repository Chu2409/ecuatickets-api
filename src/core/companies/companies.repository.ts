import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { CompanyFiltersReqDto } from './dto/req/company-filters.dto'
import { CompanyResDto } from './dto/res/compy.dto'
import { Prisma } from '@prisma/client'
import { CreateCompanyReqDto } from './dto/req/create-company.dto'
import { UpdateCompanyReqDto } from './dto/req/update-company.dto'

@Injectable()
export class CompaniesRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async findMany(
    filters: CompanyFiltersReqDto,
  ): Promise<[CompanyResDto[], number]> {
    const { limit, page, search } = filters

    const whereClause: Prisma.CompanyWhereInput = {}

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
      this.dbService.company.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        orderBy: {
          id: 'desc',
        },
      }),
      this.dbService.company.count({
        where: whereClause,
      }),
    ])

    return [entities, total]
  }

  async findById(id: number) {
    return this.dbService.company.findUnique({
      where: { id },
    })
  }

  async create(data: CreateCompanyReqDto) {
    return this.dbService.company.create({
      data: {
        ...data,
      },
    })
  }

  async update(id: number, data: UpdateCompanyReqDto) {
    return this.dbService.company.update({
      where: { id },
      data: {
        ...data,
      },
    })
  }

  async remove(id: number) {
    return this.dbService.company.delete({
      where: { id },
    })
  }

  async changeStatus(id: number, isActive: boolean) {
    return this.dbService.company.update({
      where: { id },
      data: {
        isActive,
      },
    })
  }
}
