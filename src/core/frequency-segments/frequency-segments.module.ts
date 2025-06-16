import { Module } from '@nestjs/common'
import { FrequencySegmentsService } from './frequency-segments.service'
import { FrequencySegmentsController } from './frequency-segments.controller'
import { FrequencySegmentsStopsRepository } from './frequency-segments.repository'

@Module({
  controllers: [FrequencySegmentsController],
  providers: [FrequencySegmentsService, FrequencySegmentsStopsRepository],
  exports: [FrequencySegmentsService],
})
export class FrequencySegmentsModule {}
