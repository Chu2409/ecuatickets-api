import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { CompanyCustomizationsRepository } from './customizations.repository'
import { CustomizationFiltersDto } from './dto/req/customization-filters.dto'
import { CreateCustomizationDto } from './dto/req/create-customization.dto'
import { UpdateCustomizationDto } from './dto/req/update-customization.dto'

@Injectable()
export class CustomizationsService {
  constructor(private repository: CompanyCustomizationsRepository) {}

  async findAll(filters: CustomizationFiltersDto) {
    const [entities, total] = await this.repository.findMany(filters)

    return {
      records: entities,
      total,
      limit: filters.limit,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    }
  }

  async create(dto: CreateCustomizationDto) {
    const entity = await this.repository.create(dto)
    return !!entity
  }

  async update(dto: UpdateCustomizationDto) {
    await this.findByCompanyId(dto.companyId)

    const entity = await this.repository.update(dto)
    return !!entity
  }

  async findOne(id: number) {
    const found = await this.repository.findById(id)

    if (!found) {
      throw new NotFoundException(
        `Company customization with id ${id} not found`,
      )
    }

    return found
  }

  async findByCompanyId(companyId: number) {
    const found = await this.repository.findByCompanyId(companyId)

    if (!found) {
      throw new NotFoundException(
        `Company customization for company ${companyId} not found`,
      )
    }

    return found
  }

  async remove(id: number) {
    await this.findOne(id)
    const deleted = await this.repository.remove(id)
    return !!deleted
  }

  private async validateCompanyCustomizationUniqueness({
    companyId,
    excludeId,
  }: {
    companyId: number
    excludeId?: number
  }) {
    const existing = await this.repository.verifyIfExists({
      companyId,
      excludeId,
    })

    if (existing) {
      throw new DisplayableException(
        'La compañía ya tiene una customización configurada',
        HttpStatus.CONFLICT,
      )
    }
  }
}
