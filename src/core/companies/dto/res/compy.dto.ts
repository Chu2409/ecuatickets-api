import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CompanyResDto {
  @ApiProperty({
    description: 'id de la compañia',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'The name of the company',
    example: 'Company Name',
  })
  name: string

  @ApiPropertyOptional({
    description: 'The logo url of the company',
    example: 'https://example.com/logo.png',
  })
  logoUrl: string | null

  @ApiPropertyOptional({
    description: 'The support contact of the company',
    example: '0967229875',
  })
  supportContact: string | null

  @ApiProperty({
    description: 'The status of the company',
    example: true,
  })
  isActive: boolean

  @ApiProperty({
    description: 'The created at date of the company',
    example: '2023-10-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'The updated at date of the company',
    example: '2023-10-01T00:00:00.000Z',
  })
  updatedAt: Date
}
