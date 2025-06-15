import { ApiProperty } from "@nestjs/swagger";

// DTO para respuesta de limpiar asientos
export class ClearSeatsResDto {

  @ApiProperty({
    description: 'Number of seats deleted',
    example: 40
  })
  deletedSeats: number;

  @ApiProperty({
    description: 'Number of configurations deleted',
    example: 2
  })
  deletedConfigurations: number;
}
