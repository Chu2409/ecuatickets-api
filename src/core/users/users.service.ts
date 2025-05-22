import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { UpdateUserReqDto } from './dto/req/update-user.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { hashPassword } from 'src/common/utils/encrypter'
import { CreateUserReqDto } from './dto/req/create-user.dto'
import { UserFiltersReqDto } from './dto/req/user-filters.dto'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findAll(filters: UserFiltersReqDto) {
    const [entities, total] = await this.usersRepository.findMany(filters)

    return {
      records: entities,
      total,
      limit: filters.limit,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    }
  }

  async create(dto: CreateUserReqDto) {
    await this.validateUserUniqueness({
      username: dto.username,
      email: dto.email,
      dni: dto.dni,
    })

    dto.password = hashPassword(dto.password)

    const entity = await this.usersRepository.create(dto)

    return !!entity
  }

  async update(id: number, dto: UpdateUserReqDto) {
    await this.findOne(id) // Verify user exists

    if (dto.username || dto.email) {
      await this.validateUserUniqueness({
        username: dto.username,
        email: dto.email,
        excludeUserId: id,
        dni: dto.dni,
      })
    }

    if (dto.password) {
      dto.password = hashPassword(dto.password)
    }

    const entity = await this.usersRepository.updateWithPerson(id, dto)

    return !!entity
  }

  async findOne(id: number) {
    const userFound = await this.usersRepository.findById(id)

    if (!userFound) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    return userFound
  }

  async findOneWithPasswordByUsername(username: string) {
    const userFound = await this.usersRepository.verifyIfExists({ username })

    return userFound
  }

  async remove(id: number) {
    await this.findOne(id) // Verify user exists

    const deletedUser = await this.usersRepository.remove(id)

    return !!deletedUser
  }

  private async validateUserUniqueness({
    email,
    excludeUserId,
    username,
    dni,
  }: {
    username?: string
    email?: string
    dni?: string
    excludeUserId?: number
  }) {
    if (!username && !email) return

    const existingUser = await this.usersRepository.verifyIfExists({
      username,
      email,
      excludeUserId,
      dni,
    })

    if (existingUser) {
      if (existingUser.username === username) {
        throw new DisplayableException(
          'El nombre de usuario ya está en uso',
          HttpStatus.CONFLICT,
        )
      } else if (existingUser.email === email) {
        throw new DisplayableException(
          'El correo electrónico ya está en uso',
          HttpStatus.CONFLICT,
        )
      } else if (existingUser.dni === dni) {
        throw new DisplayableException(
          'El DNI ya está en uso',
          HttpStatus.CONFLICT,
        )
      }
    }
  }

  async changeStatus(id: number) {
    const user = await this.findOne(id)

    const changed = await this.usersRepository.changeStatus(id, !user.isActive)

    return !!changed
  }
}
