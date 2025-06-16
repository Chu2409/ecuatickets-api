import { Injectable } from '@nestjs/common'
import { CustomizationFiltersDto } from './dto/req/customization-filters.dto'
import { DatabaseService } from 'src/global/database/database.service'
import { UpdateCustomizationDto } from './dto/req/update-customization.dto'
import { CreateCustomizationDto } from './dto/req/create-customization.dto'

@Injectable()
export class CompanyCustomizationsRepository {
  constructor(private prisma: DatabaseService) {}

  async findMany(filters: CustomizationFiltersDto) {
    const { page, limit, companyId, hexcode } = filters
    const skip = (page - 1) * limit

    const where = {
      ...(companyId && { companyId }),
      ...(hexcode && { hexcode }),
    }

    const [records, total] = await Promise.all([
      this.prisma.companyCustomization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.companyCustomization.count({ where }),
    ])

    return [records, total] as const
  }

  async findById(id: number) {
    return await this.prisma.companyCustomization.findUnique({
      where: { id },
    })
  }

  async findByCompanyId(companyId: number) {
    return await this.prisma.companyCustomization.findUnique({
      where: { companyId },
    })
  }

  async create(dto: CreateCustomizationDto) {
    return await this.prisma.companyCustomization.create({
      data: dto,
    })
  }

  async update(dto: UpdateCustomizationDto) {
    return await this.prisma.companyCustomization.update({
      where: { companyId: dto.companyId },
      data: dto,
    })
  }

  async remove(id: number) {
    return await this.prisma.companyCustomization.delete({
      where: { id },
    })
  }

  async verifyIfExists({
    companyId,
    excludeId,
  }: {
    companyId: number
    excludeId?: number
  }) {
    return await this.prisma.companyCustomization.findFirst({
      where: {
        companyId,
        ...(excludeId && { id: { not: excludeId } }),
      },
    })
  }
}
