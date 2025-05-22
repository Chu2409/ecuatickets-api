import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCompanyReqDto } from './dto/req/create-company.dto'
import { UpdateCompanyReqDto } from './dto/req/update-company.dto'
import { CompaniesRepository } from './companies.repository'
import { CompanyFiltersReqDto } from './dto/req/company-filters.dto'

@Injectable()
export class CompaniesService {
  constructor(private repository: CompaniesRepository) {}

  async findAll(filters: CompanyFiltersReqDto) {
    const [entities, total] = await this.repository.findMany(filters)

    return {
      records: entities,
      total,
      limit: filters.limit,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    }
  }

  async create(dto: CreateCompanyReqDto) {
    const entity = await this.repository.create(dto)

    return !!entity
  }

  async update(id: number, dto: UpdateCompanyReqDto) {
    await this.findOne(id) // Verify user exists

    const entity = await this.repository.update(id, dto)

    return !!entity
  }

  async findOne(id: number) {
    const found = await this.repository.findById(id)

    if (!found) {
      throw new NotFoundException(`Company with id ${id} not found`)
    }

    return found
  }

  async remove(id: number) {
    await this.findOne(id) // Verify user exists

    const deleted = await this.repository.remove(id)

    return !!deleted
  }

  async changeStatus(id: number) {
    const entity = await this.findOne(id)

    const changed = await this.repository.changeStatus(id, !entity.isActive)

    return !!changed
  }
}
