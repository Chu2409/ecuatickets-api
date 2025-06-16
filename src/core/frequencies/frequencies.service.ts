import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateFrequencyReqDto } from './dto/req/create-frequency.dto'
import { UpdateFrequencyReqDto } from './dto/req/update-frequency.dto'
import { FrequenciesRepository } from './frequencies.repository'
import { FrequencyFiltersReqDto } from './dto/req/frequency-filters.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'

@Injectable()
export class FrequenciesService {
  constructor(private repository: FrequenciesRepository) {}

  async findAll(filters: FrequencyFiltersReqDto) {
    const [entities, total] = await this.repository.findMany(filters)

    return {
      records: entities,
      total,
      limit: filters.limit,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    }
  }

  async create(dto: CreateFrequencyReqDto) {
    await this.validateFrequencyUniqueness({
      time: dto.time,
      originId: dto.originId,
      destinationId: dto.destinationId,
      companyId: dto.companyId,
    })

    const entity = await this.repository.create(dto)

    return !!entity
  }

  async update(id: number, dto: UpdateFrequencyReqDto) {
    await this.findOne(id, dto.companyId)

    if (dto.time || dto.originId || dto.destinationId) {
      await this.validateFrequencyUniqueness({
        time: dto.time,
        originId: dto.originId,
        destinationId: dto.destinationId,
        companyId: dto.companyId,
        excludeId: id,
      })
    }

    const entity = await this.repository.update(id, dto)

    return !!entity
  }

  async findOne(id: number, companyId: number) {
    const found = await this.repository.findById(id, companyId)

    if (!found) {
      throw new NotFoundException(`Company frequency with id ${id} not found`)
    }

    return found
  }

  async remove(id: number, companyId: number) {
    await this.findOne(id, companyId)
    const deleted = await this.repository.remove(id)

    return !!deleted
  }

  private async validateFrequencyUniqueness({
    time,
    originId,
    destinationId,
    companyId,
    excludeId,
  }: {
    time?: string
    originId?: number
    destinationId?: number
    companyId?: number
    excludeId?: number
  }) {
    const existing = await this.repository.verifyIfExists({
      time,
      originId,
      destinationId,
      companyId,
      excludeId,
    })

    if (existing) {
      throw new DisplayableException(
        'Ya existe una frecuencia con el mismo horario y ruta para esta compañía',
        HttpStatus.CONFLICT,
      )
    }
  }

  async changeStatus(id: number, companyId: number) {
    const found = await this.findOne(id, companyId)

    const entity = await this.repository.changeStatus(id, !found.active)

    return !!entity
  }
}
