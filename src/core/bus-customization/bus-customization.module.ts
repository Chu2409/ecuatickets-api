import { Module } from '@nestjs/common'
import { BusCustomizationController } from './bus-customization.controller'
import { BusCustomizationRepository } from './bus-customization.repository'
import { BusCustomizationService } from './bus-customization.service'
import { TemplateSeatsModule } from './template-seats/template-seats.module'
import { SeatTypesModule } from './seat-types/seat-types.module'

@Module({
  imports: [TemplateSeatsModule, SeatTypesModule],
  controllers: [BusCustomizationController],
  providers: [BusCustomizationRepository, BusCustomizationService],
  exports: [BusCustomizationService, TemplateSeatsModule, SeatTypesModule],
})
export class BusCustomizationModule {}
