import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { ColorsRepository } from './colorRepository.service'
import { CreateColorDto } from './dto/req/create-color.dto'
import { UpdateColorDto } from './dto/req/update-color.dto'

@Injectable()
export class ColorsService {
  constructor(private repository: ColorsRepository) {}

  async findAll() {
    const colors = await this.repository.findMany()
    return colors
  }

  async create(dto: CreateColorDto) {
    await this.validateColorUniqueness({
      hexCode: dto.hexCode,
    })

    const entity = await this.repository.create(dto)
    return !!entity
  }

  async update(hexCode: string, dto: UpdateColorDto) {
    await this.findOne(hexCode)

    if (dto.hexCode) {
      await this.validateColorUniqueness({
        hexCode: dto.hexCode,
      })
    }

    const entity = await this.repository.update(hexCode, dto)
    return !!entity
  }

  async findOne(hexCode: string) {
    const found = await this.repository.findById(hexCode)

    if (!found) {
      throw new NotFoundException(`Color with hexCode ${hexCode} not found`)
    }

    return found
  }

  async remove(hexCode: string) {
    await this.findOne(hexCode)
    const deleted = await this.repository.remove(hexCode)
    return !!deleted
  }

  private async validateColorUniqueness({
    name,
    hexCode,
    excludeId,
  }: {
    name?: string
    hexCode?: string
    excludeId?: number
  }) {
    const existing = await this.repository.verifyIfExists({
      name,
      hexCode,
      excludeId,
    })

    if (existing) {
      if (existing.hexCode === hexCode) {
        throw new DisplayableException(
          'Ya existe un color con este código hexadecimal',
          HttpStatus.CONFLICT,
        )
      }
    }
  }
}
