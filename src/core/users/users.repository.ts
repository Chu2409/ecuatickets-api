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
          person: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          person: {
            surname: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          person: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          person: {
            dni: {
              contains: search,
              mode: 'insensitive',
            },
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
        include: {
          person: true,
        },
        omit: {
          personId: true,
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
      include: {
        person: true,
      },
      omit: {
        personId: true,
      },
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
      conditions.OR?.push({ person: { email } })
    }

    if (dni) {
      conditions.OR?.push({ person: { dni } })
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
        person: true,
      },
    })
  }

  async create(userData: CreateUserReqDto) {
    return this.dbService.user.create({
      data: {
        username: userData.username,
        password: userData.password,
        role: userData.role,
        isActive: userData.isActive,
        company: {
          connect: {
            id: userData.companyId,
          },
        },
        person: {
          create: {
            ...userData.person,
          },
        },
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
        username: data.username,
        password: data.password,
        role: data.role,
        isActive: data.isActive,
        company: data.companyId
          ? {
              connect: {
                id: data.companyId,
              },
            }
          : undefined,
        person: {
          update: {
            ...data.person,
          },
        },
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
