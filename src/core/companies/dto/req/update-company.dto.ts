import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { CreateCompanyReqDto } from './create-company.dto'
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator'

export class UpdateCompanyReqDto extends PartialType(CreateCompanyReqDto) {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Company name',
    example: 'My Company',
  })
  name?: string

  @IsUrl()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Company logo URL',
    example: 'https://example.com/logo.png',
  })
  logoUrl?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Support contact information',
    example: '0967229875',
  })
  supportContact?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Is the company active',
    example: true,
  })
  isActive?: boolean
}
