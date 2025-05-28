import { Module } from '@nestjs/common'
import { CustomizationsController } from './customizations.controller'
import { CustomizationsService } from './customizations.service'
import { CompanyCustomizationsRepository } from './customizationRepository.service'
import { ColorsService } from '../colors/colors.service'
import { ColorsRepository } from '../colors/colorRepository.service'
import { FileUploadService } from 'src/common/utils/file-upload'

@Module({
  controllers: [CustomizationsController],
  providers: [
    CustomizationsService,
    CompanyCustomizationsRepository,
    ColorsService,
    ColorsRepository,
    FileUploadService,
  ],
})
export class CustomizationsModule {}
