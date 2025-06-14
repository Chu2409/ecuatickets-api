import { Module } from '@nestjs/common'
import { RouteSheetsService } from './route-sheets.service'
import { RouteSheetsController } from './route-sheets.controller'
import { RouteSheetsRepository } from './route-sheets.repository'

@Module({
  controllers: [RouteSheetsController],
  providers: [RouteSheetsService, RouteSheetsRepository],
})
export class RouteSheetsModule {}
