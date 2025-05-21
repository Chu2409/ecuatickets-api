import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { UpdateUserReqDto } from './dto/req/update-user.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { hashPassword } from 'src/common/utils/encrypter'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateUserReqDto } from './dto/req/create-user.dto'
import { Prisma } from '@prisma/client'
import { UserFiltersReqDto } from './dto/req/user-filters.dto'
import { USER_STATUS } from './types/user-status.enum'

@Injectable()
export class UsersService {
  constructor(private dbService: DatabaseService) {}

  async findAll({ limit, page, search }: UserFiltersReqDto) {
    const whereClause: Prisma.UserWhereInput = {
      person: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    }

    const [entities, total] = await Promise.all([
      this.dbService.user.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        orderBy: {
          id: 'desc',
        },
        omit: {
          password: true,
        },
      }),
      this.dbService.user.count({
        where: whereClause,
      }),
    ])

    return {
      records: entities,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async create(dto: CreateUserReqDto) {
    const alreadyExists = await this.dbService.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          { person: { email: dto.person.email } },
        ],
      },
    })

    if (alreadyExists)
      throw new DisplayableException(
        'El usuario ya existe',
        HttpStatus.BAD_REQUEST,
      )

    const entity = await this.dbService.user.create({
      data: {
        ...dto,
        password: hashPassword(dto.password),
        person: {
          create: dto.person,
        },
      },
    })

    return !!entity
  }

  async update(id: number, dto: UpdateUserReqDto) {
    await this.findOne(id) // Verify user exists

    const alreadyExists = await this.dbService.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          { person: { email: dto.person?.email } },
        ],
        NOT: {
          id,
        },
      },
    })
    if (alreadyExists)
      throw new DisplayableException(
        'El usuario ya existe',
        HttpStatus.BAD_REQUEST,
      )

    const entity = await this.dbService.user.update({
      where: { id },
      data: {
        ...dto,
        password: dto.password ? hashPassword(dto.password) : undefined,
        person: {
          update: dto.person,
        },
      },
    })

    return !!entity
  }

  async findOne(id: number) {
    const userFound = await this.dbService.user.findFirst({
      where: { id },
      include: {
        person: true,
      },
    })

    if (!userFound) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    return userFound
  }

  async remove(id: number) {
    await this.findOne(id) // Verify user exists

    const deletedUser = await this.dbService.user.delete({
      where: { id },
    })

    return !!deletedUser
  }

  async changeStatus(id: number, status: USER_STATUS) {
    await this.findOne(id)

    const user = await this.dbService.user.update({
      where: { id },
      data: {
        status,
      },
    })

    return !!user
  }
}
