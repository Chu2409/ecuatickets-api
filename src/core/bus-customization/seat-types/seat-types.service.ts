import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { SeatTypesRepository } from './seat-types.repository'
import { SeatTypeFilterReqDto } from './dto/req/seat-type.filters'
import { CreateSeatTypeReqDto } from './dto/req/create-seat-type.dto'
import { UpdateSeatTypeReqDto } from './dto/req/update-seat-type.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'

@Injectable()
export class SeatTypesService {
  constructor(private respository: SeatTypesRepository) {}

  async findAll(filters: SeatTypeFilterReqDto) {
    const [entities, total] = await this.respository.findMany(filters)

    return {
      records: entities,
      total,
      limit: filters.limit,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    }
  }

  async create(dto: CreateSeatTypeReqDto) {
    await this.validateSeatTypeUniqueness({
      name: dto.name,
    })

    const entity = await this.respository.create(dto)

    return !!entity
  }

  async update(id: number, dto: UpdateSeatTypeReqDto) {
    await this.findOne(id, dto.companyId)
    if (dto.name) {
      await this.validateSeatTypeUniqueness({
        name: dto.name,
        excludeId: id,
      })
    }
    const entity = await this.respository.update(id, dto)
    return !!entity
  }

  async findOne(id: number, companyId: number) {
    const found = await this.respository.findById(id, companyId)

    if (!found) {
      throw new NotFoundException(`Company seat type with id ${id} not found`)
    }

    return found
  }

  async remove(id: number, companyId: number) {
    await this.findOne(id, companyId) // Verify user exists
    const deleted = await this.respository.remove(id)
    return !!deleted
  }

  private async validateSeatTypeUniqueness({
    name,
    excludeId,
  }: {
    name: string
    excludeId?: number
  }) {
    const existing = await this.respository.verifyIfExists({ name, excludeId })

    if (existing) {
      if (existing.name === name) {
        throw new DisplayableException(
          'El tipo de asiento ya existe',
          HttpStatus.CONFLICT,
        )
      }
    }
  }
}
