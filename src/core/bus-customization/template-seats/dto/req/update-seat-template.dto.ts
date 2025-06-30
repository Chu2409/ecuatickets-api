import { IsString, IsOptional, IsInt, IsBoolean, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTemplateSeatDto } from './create-seat-template.dto';

export class UpdateSeatTemplateDto {
  @ApiProperty({
    description: 'Nombre de la plantilla',
    example: 'Bus Estándar 40 Asientos',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción de la plantilla',
    example: 'Plantilla estándar para bus de 40 asientos en una sola planta',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Número total de asientos',
    example: 40,
    minimum: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  totalSeats?: number;

  @ApiProperty({
    description: 'Número de filas',
    example: 10,
    minimum: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  rows?: number;

  @ApiProperty({
    description: 'Número de columnas',
    example: 4,
    minimum: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  columns?: number;

  @ApiProperty({
    description: 'Número de pisos',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  floors?: number;

  @ApiProperty({
    description: 'Si la plantilla está activa',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Lista de asientos de la plantilla',
    type: [CreateTemplateSeatDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTemplateSeatDto)
  @IsOptional()
  templateSeats?: CreateTemplateSeatDto[];
} 