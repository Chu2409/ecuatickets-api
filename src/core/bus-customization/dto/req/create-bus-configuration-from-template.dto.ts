import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SeatTypeConfigurationDto {
  @ApiProperty({
    description: 'ID del tipo de asiento',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  seatTypeId: number;

  @ApiProperty({
    description: 'Números de asientos que tendrán este tipo (ej: ["1A", "1B", "2A"])',
    example: ['1A', '1B', '2A', '2B'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  seatNumbers: string[];
}

export class CreateBusConfigurationFromTemplateDto {
  @ApiProperty({
    description: 'ID de la plantilla de asientos a usar',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  templateId: number;

  @ApiProperty({
    description: 'ID del bus al que se aplicará la configuración',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  busId: number;

  @ApiProperty({
    description: 'Configuración de tipos de asientos para cada número de asiento',
    type: [SeatTypeConfigurationDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatTypeConfigurationDto)
  seatTypeConfigurations: SeatTypeConfigurationDto[];
} 