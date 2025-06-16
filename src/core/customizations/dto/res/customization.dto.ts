import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CompanyCustomizationResDto {
  @ApiProperty({
    description: 'ID de la customización',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'ID de la compañía',
    example: 1,
  })
  companyId: number

  @ApiPropertyOptional({
    description: 'URL de la imagen de customización',
    example: 'https://example.com/logo.png',
  })
  imageUrl: string | null

  @ApiProperty({
    description: 'Información del color',
  })
  hexcode: string
}
