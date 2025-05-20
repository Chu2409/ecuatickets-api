import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { UpdateUserReqDto } from './dto/req/update-user.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { hashPassword } from 'src/common/utils/encrypter'
import { BaseParamsReqDto } from 'src/common/dtos/req/base-params.dto'
import { DatabaseService } from 'src/global/database/database.service'
import { user } from 'drizzle/schema'
import { count, desc, eq, sql } from 'drizzle-orm'
import { CreateUserReqDto } from './dto/req/create-user.dto'
import { USER_STATUS } from './types/user-status.enum'

@Injectable()
export class UsersService {
  constructor(private dbService: DatabaseService) {}

  async findAll({ limit, page }: BaseParamsReqDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select()
      .from(user)
      .orderBy(desc(user.id))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db.select({ count: count() }).from(user)

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async create(dto: CreateUserReqDto) {
    // Check if person is already associated
    const [alreadyExistPersonAssociated] = await this.dbService.db
      .select()
      .from(user)
      .where(
        eq(sql<string>`lower(${user.userName})`, dto.userName.toLowerCase()),
      )
      .limit(1)
      .execute()

    if (alreadyExistPersonAssociated) {
      throw new DisplayableException(
        'Ya existe una persona asociada a este usuario',
        HttpStatus.CONFLICT,
      )
    }

    const hashedPassword = hashPassword(dto.password)

    const [newUser] = await this.dbService.db
      .insert(user)
      .values({
        userName: dto.userName,
        passwordHash: hashedPassword,
        userType: dto.userType,
        status: dto.status,
        personId: 1,
      })
      .returning()
      .execute()

    return newUser
  }

  async update(id: number, dto: UpdateUserReqDto) {
    await this.findOne(id) // Verify user exists

    const updateData: Partial<UpdateUserReqDto> = { ...dto }
    if (dto.password) {
      updateData.password = hashPassword(dto.password)
    }

    const [updatedUser] = await this.dbService.db
      .update(user)
      .set(updateData)
      .where(eq(user.id, id))
      .returning()
      .execute()

    return updatedUser
  }

  async findOne(id: number) {
    const [userFound] = await this.dbService.db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1)
      .execute()

    if (!userFound) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    return userFound
  }

  async remove(id: number) {
    await this.findOne(id) // Verify user exists

    const [deletedUser] = await this.dbService.db
      .delete(user)
      .where(eq(user.id, id))
      .returning()
      .execute()

    if (!deletedUser) {
      throw new DisplayableException(
        `Error deleting user with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    return deletedUser
  }

  async changeStatus(id: number, status: USER_STATUS) {
    await this.findOne(id)

    await this.dbService.db
      .update(user)
      .set({ status })
      .where(eq(user.id, id))
      .execute()
  }

}
