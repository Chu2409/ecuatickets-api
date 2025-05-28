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
      name: dto.name,
      hexCode: dto.hexCode,
    })

    const entity = await this.repository.create(dto)
    return !!entity
  }

  async update(id: number, dto: UpdateColorDto) {
    await this.findOne(id)

    if (dto.name || dto.hexCode) {
      await this.validateColorUniqueness({
        name: dto.name,
        hexCode: dto.hexCode,
        excludeId: id,
      })
    }

    const entity = await this.repository.update(id, dto)
    return !!entity
  }

  async findOne(id: number) {
    const found = await this.repository.findById(id)

    if (!found) {
      throw new NotFoundException(`Color with id ${id} not found`)
    }

    return found
  }

  async remove(id: number) {
    await this.findOne(id)
    const deleted = await this.repository.remove(id)
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
      if (existing.name === name) {
        throw new DisplayableException(
          'Ya existe un color con este nombre',
          HttpStatus.CONFLICT,
        )
      }
      if (existing.hexCode === hexCode) {
        throw new DisplayableException(
          'Ya existe un color con este código hexadecimal',
          HttpStatus.CONFLICT,
        )
      }
    }
  }
}
