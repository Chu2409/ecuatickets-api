import { ApiProperty } from '@nestjs/swagger';

export class SeatTemplateHeaderDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Bus Estándar 40 Asientos' })
  name: string;

  @ApiProperty({ example: 'Plantilla estándar para bus de 40 asientos en una sola planta', required: false })
  description?: string;

  @ApiProperty({ example: 40 })
  totalSeats: number;

  @ApiProperty({ example: 10 })
  rows: number;

  @ApiProperty({ example: 4 })
  columns: number;

  @ApiProperty({ example: 1 })
  floors: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-06-29T00:00:00.000Z' })
  createdAt: Date;
} 