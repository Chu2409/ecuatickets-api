import { Module } from '@nestjs/common'
import { FrequenciesService } from './frequencies.service'
import { FrequenciesRepository } from './frequencies.repository'
import { FrequenciesController } from './frequencies.controller'

@Module({
  controllers: [FrequenciesController],
  providers: [FrequenciesService, FrequenciesRepository],
})
export class FrequenciesModule {}
