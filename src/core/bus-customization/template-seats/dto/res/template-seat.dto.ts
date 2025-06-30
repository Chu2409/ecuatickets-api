import { ApiProperty } from '@nestjs/swagger';

export class TemplateSeatDto {
  @ApiProperty({
    description: 'ID único del asiento de plantilla',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Número del asiento',
    example: '1A',
  })
  seatNumber: string;

  @ApiProperty({
    description: 'Número de fila',
    example: 1,
  })
  row: number;

  @ApiProperty({
    description: 'Número de columna',
    example: 1,
  })
  column: number;

  @ApiProperty({
    description: 'Número de piso',
    example: 1,
  })
  floor: number;

  @ApiProperty({
    description: 'Si es un pasillo',
    example: false,
  })
  isAisle: boolean;

  @ApiProperty({
    description: 'ID de la plantilla a la que pertenece',
    example: 1,
  })
  templateId: number;
} 