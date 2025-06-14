import { Module } from '@nestjs/common'
import { CustomizationsController } from './customizations.controller'
import { CustomizationsService } from './customizations.service'
import { CompanyCustomizationsRepository } from './customizations.repository'
import { FileUploadService } from 'src/common/utils/file-upload'

@Module({
  controllers: [CustomizationsController],
  providers: [
    CustomizationsService,
    CompanyCustomizationsRepository,
    FileUploadService,
  ],
})
export class CustomizationsModule {}
