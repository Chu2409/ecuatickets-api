import { IsString, IsOptional, IsInt, IsBoolean, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateSeatDto {
  @ApiProperty({
    description: 'Número del asiento (ej: "1A", "2B")',
    example: '1A',
  })
  @IsString()
  seatNumber: string;

  @ApiProperty({
    description: 'Número de fila',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  row: number;

  @ApiProperty({
    description: 'Número de columna',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  column: number;

  @ApiProperty({
    description: 'Número de piso',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  floor?: number;

  @ApiProperty({
    description: 'Si es un pasillo (sin asiento)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAisle?: boolean;
}

export class CreateSeatTemplateDto {
  @ApiProperty({
    description: 'Nombre de la plantilla',
    example: 'Bus Estándar 40 Asientos',
  })
  @IsString()
  name: string;

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
  })
  @IsInt()
  @Min(1)
  totalSeats: number;

  @ApiProperty({
    description: 'Número de filas',
    example: 10,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  rows: number;

  @ApiProperty({
    description: 'Número de columnas',
    example: 4,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  columns: number;

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
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTemplateSeatDto)
  templateSeats: CreateTemplateSeatDto[];
} 