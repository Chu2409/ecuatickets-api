import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive, IsNumber } from 'class-validator'

export class CustomizationFiltersDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    default: 1,
  })
  page: number = 1

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Límite de registros por página',
    example: 10,
    default: 10,
  })
  limit: number = 10

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Filtrar por ID de compañía',
    example: 1,
  })
  companyId?: number

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Filtrar por ID de color',
    example: 1,
  })
  colorId?: number
}
