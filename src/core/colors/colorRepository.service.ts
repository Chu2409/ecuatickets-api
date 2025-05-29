import { Injectable } from '@nestjs/common'
import { CreateColorDto } from './dto/req/create-color.dto'
import { UpdateColorDto } from './dto/req/update-color.dto'
import { DatabaseService } from 'src/global/database/database.service'

@Injectable()
export class ColorsRepository {
  constructor(private prisma: DatabaseService) {}

  async findMany() {
    return await this.prisma.color.findMany({
      orderBy: { hexCode: 'asc' },
    })
  }

  async findById(hexCode: string) {
    return await this.prisma.color.findUnique({
      where: { hexCode },
    })
  }

  async create(dto: CreateColorDto) {
    return await this.prisma.color.create({
      data: dto,
    })
  }

  async update(hexCode: string, dto: UpdateColorDto) {
    return await this.prisma.color.update({
      where: { hexCode },
      data: dto,
    })
  }

  async remove(hexCode: string) {
    return await this.prisma.color.delete({
      where: { hexCode },
    })
  }

  async verifyIfExists({
    name,
    hexCode,
    excludeId,
  }: {
    name?: string
    hexCode?: string
    excludeId?: number
  }) {
    const conditions: Array<{ name?: string; hexCode?: string }> = []

    if (name) {
      conditions.push({ name })
    }

    if (hexCode) {
      conditions.push({ hexCode })
    }

    if (conditions.length === 0) return null

    return await this.prisma.color.findFirst({
      where: {
        OR: conditions,
        ...(excludeId && { id: { not: excludeId } }),
      },
    })
  }
}
