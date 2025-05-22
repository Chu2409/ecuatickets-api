import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'

export class CreateCompanyReqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Company name',
    example: 'My Company',
  })
  name: string

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
