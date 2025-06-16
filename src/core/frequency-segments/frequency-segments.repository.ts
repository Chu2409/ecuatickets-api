import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateFrequencySegmentReqDto } from './dto/req/create-frequency-segment.dto'
import { UpdateFrequencySegmentReqDto } from './dto/req/update-frequency-segment.dto'

@Injectable()
export class FrequencySegmentsStopsRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async create(dto: CreateFrequencySegmentReqDto) {
    return await this.dbService.frequencySegmentPrice.create({
      data: {
        price: dto.price,
        originId: dto.originId,
        destinationId: dto.destinationId,
        frequencyId: dto.frequencyId,
      },
    })
  }

  async update(id: number, dto: UpdateFrequencySegmentReqDto) {
    return await this.dbService.frequencySegmentPrice.update({
      where: { id },
      data: dto,
    })
  }
}
