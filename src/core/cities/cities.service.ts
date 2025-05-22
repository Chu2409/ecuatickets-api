import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCityReqDto } from './dto/req/create-city.dto'
import { UpdateCityReqDto } from './dto/req/update-city.dto'
import { CitiesRepository } from './cities.repository'
import { CityFiltersReqDto } from './dto/req/city-filters.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'

@Injectable()
export class CitiesService {
  constructor(private repository: CitiesRepository) {}

  async findAll(filters: CityFiltersReqDto) {
    const [entities, total] = await this.repository.findMany(filters)

    return {
      records: entities,
      total,
      limit: filters.limit,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    }
  }

  async create(dto: CreateCityReqDto) {
    await this.validateCityUniqueness({
      name: dto.name,
      province: dto.province,
    })

    const entity = await this.repository.create(dto)

    return !!entity
  }

  async update(id: number, dto: UpdateCityReqDto) {
    await this.findOne(id)

    if (dto.name && dto.province) {
      await this.validateCityUniqueness({
        name: dto.name,
        province: dto.province,
      })
    }

    const entity = await this.repository.update(id, dto)

    return !!entity
  }

  async findOne(id: number) {
    const found = await this.repository.findById(id)

    if (!found) {
      throw new NotFoundException(`City with id ${id} not found`)
    }

    return found
  }

  async remove(id: number) {
    await this.findOne(id) // Verify user exists

    const deleted = await this.repository.remove(id)

    return !!deleted
  }

  private async validateCityUniqueness({
    name,
    province,
    excludeId,
  }: {
    name: string
    province: string
    excludeId?: number
  }) {
    const existing = await this.repository.verifyIfExists({
      name,
      province,
      excludeId,
    })

    if (existing) {
      if (existing.name === name) {
        throw new DisplayableException(
          'El nombre de la ciudad ya está en uso',
          HttpStatus.CONFLICT,
        )
      } else if (existing.province === province) {
        throw new DisplayableException(
          'El nombre de la provincia ya está en uso',
          HttpStatus.CONFLICT,
        )
      }
    }
  }
}
