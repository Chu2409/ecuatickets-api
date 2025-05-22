import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateBusReqDto } from './dto/req/create-bus.dto'
import { UpdateBusReqDto } from './dto/req/update-bus.dto'
import { BusesRepository } from './buses.repository'
import { BusFiltersReqDto } from './dto/req/bus-filters.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'

@Injectable()
export class BusesService {
  constructor(private repository: BusesRepository) {}

  async findAll(filters: BusFiltersReqDto) {
    const [entities, total] = await this.repository.findMany(filters)

    return {
      records: entities,
      total,
      limit: filters.limit,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    }
  }

  async create(dto: CreateBusReqDto) {
    await this.validateBusUniqueness({
      licensePlate: dto.licensePlate,
    })

    const entity = await this.repository.create(dto)

    return !!entity
  }

  async update(id: number, dto: UpdateBusReqDto) {
    await this.findOne(id)

    if (dto.licensePlate) {
      await this.validateBusUniqueness({
        licensePlate: dto.licensePlate,
        excludeId: id,
      })
    }

    const entity = await this.repository.update(id, dto)

    return !!entity
  }

  async findOne(id: number) {
    const found = await this.repository.findById(id)

    if (!found) {
      throw new NotFoundException(`Bus with id ${id} not found`)
    }

    return found
  }

  async remove(id: number) {
    await this.findOne(id) // Verify user exists

    const deleted = await this.repository.remove(id)

    return !!deleted
  }

  private async validateBusUniqueness({
    licensePlate,
    excludeId,
  }: {
    licensePlate: string
    excludeId?: number
  }) {
    const existing = await this.repository.verifyIfExists({
      licensePlate,
      excludeId,
    })

    if (existing) {
      if (existing.licensePlate === licensePlate) {
        throw new DisplayableException(
          'La matrícula del bus ya está en uso',
          HttpStatus.CONFLICT,
        )
      }
    }
  }

  async changeStatus(id: number) {
    const found = await this.findOne(id) // Verify user exists

    const entity = await this.repository.changeStatus(id, !found.isActive)

    return !!entity
  }
}
