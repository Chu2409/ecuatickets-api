import { Injectable } from '@nestjs/common'
import { UpdateFrequencySegmentReqDto } from './dto/req/update-frequency-segment.dto'
import { CreateFrequencySegmentReqDto } from './dto/req/create-frequency-segment.dto'
import { FrequencySegmentsStopsRepository } from './frequency-segments.repository'

@Injectable()
export class FrequencySegmentsService {
  constructor(private repository: FrequencySegmentsStopsRepository) {}

  async create(dto: CreateFrequencySegmentReqDto) {
    return this.repository.create(dto)
  }

  async update(id: number, dto: UpdateFrequencySegmentReqDto) {
    return this.repository.update(id, dto)
  }
}
