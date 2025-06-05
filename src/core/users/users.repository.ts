import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { UserFiltersReqDto } from './dto/req/user-filters.dto'
import { Prisma } from '@prisma/client'
import { CreateUserReqDto } from './dto/req/create-user.dto'
import { UpdateUserReqDto } from './dto/req/update-user.dto'
import { BaseUserResDto } from './dto/res/user.dto'

@Injectable()
export class UsersRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async findMany(
    filters: UserFiltersReqDto,
  ): Promise<[BaseUserResDto[], number]> {
    const { limit, page, search } = filters

    const whereClause: Prisma.UserWhereInput = {}

    if (search) {
      whereClause.OR = [
        {
          username: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          surname: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          dni: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }

    const [entities, total] = await Promise.all([
      this.dbService.user.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        orderBy: {
          id: 'desc',
        },
      }),
      this.dbService.user.count({
        where: whereClause,
      }),
    ])

    return [entities, total]
  }

  async findById(id: number) {
    return this.dbService.user.findUnique({
      where: { id },
    })
  }

  async verifyIfExists({
    email,
    username,
    dni,
    excludeUserId,
  }: {
    username?: string
    email?: string
    dni?: string
    excludeUserId?: number
  }) {
    if (!username && !email && !dni) return null

    const conditions: Prisma.UserWhereInput = {
      OR: [],
      NOT: {},
    }

    if (username) {
      conditions.OR?.push({ username })
    }

    if (email) {
      conditions.OR?.push({ email })
    }

    if (dni) {
      conditions.OR?.push({ dni })
    }

    if (excludeUserId) {
      conditions.NOT = { id: excludeUserId }
    }

    return this.dbService.user.findFirst({
      where: conditions,
      omit: {
        companyId: true,
      },
      include: {
        company: true,
      },
    })
  }

  async create(userData: CreateUserReqDto) {
    return this.dbService.user.create({
      data: {
        ...userData,
      },
      omit: {
        companyId: true,
      },
    })
  }

  async updateWithPerson(id: number, data: UpdateUserReqDto) {
    return this.dbService.user.update({
      where: { id },
      data: {
        ...data,
      },
      omit: {
        companyId: true,
      },
    })
  }

  async remove(id: number) {
    return this.dbService.user.delete({
      where: { id },
      include: {
        company: true,
      },
    })
  }

  async changeStatus(id: number, isActive: boolean) {
    return this.dbService.user.update({
      where: { id },
      data: {
        isActive,
      },
      omit: {
        companyId: true,
      },
    })
  }
}
