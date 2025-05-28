import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ColorResDto } from '../../../colors/dto/res/color.dto'

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
    description: 'ID del color seleccionado',
    example: 1,
  })
  colorId: number

  @ApiProperty({
    description: 'Información del color',
    type: ColorResDto,
  })
  color: ColorResDto
}
