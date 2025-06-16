import { Module } from '@nestjs/common'
import { BusCustomizationController } from './bus-customization.controller'
import { BusCustomizationRepository } from './bus-customization.repository'
import { BusCustomizationService } from './bus-customization.service'

@Module({
  controllers: [BusCustomizationController],
  providers: [BusCustomizationRepository, BusCustomizationService],
})
export class BusCustomizationModule {}
