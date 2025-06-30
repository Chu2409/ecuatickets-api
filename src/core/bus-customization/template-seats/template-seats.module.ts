import { Module } from '@nestjs/common';
import { TemplateSeatsController } from './template-seats.controller';
import { TemplateSeatsService } from './template-seats.service';
import { TemplateSeatsRepository } from './template-seats.repository';
import { DatabaseModule } from '../../../global/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TemplateSeatsController],
  providers: [TemplateSeatsService, TemplateSeatsRepository],
  exports: [TemplateSeatsService],
})
export class TemplateSeatsModule {} 