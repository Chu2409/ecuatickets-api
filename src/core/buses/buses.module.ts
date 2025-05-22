import { Module } from '@nestjs/common'
import { BusesService } from './buses.service'
import { BusesController } from './buses.controller'
import { BusesRepository } from './buses.repository'

@Module({
  controllers: [BusesController],
  providers: [BusesService, BusesRepository],
})
export class BusesModule {}
