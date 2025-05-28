import { Module } from '@nestjs/common'
import { ColorsService } from './colors.service'
import { ColorsController } from './colors.controller'
import { ColorsRepository } from './colorRepository.service'

@Module({
  controllers: [ColorsController],
  providers: [ColorsService, ColorsRepository],
})
export class ColorsModule {}
