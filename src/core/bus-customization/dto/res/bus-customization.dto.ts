import { ApiProperty } from '@nestjs/swagger';

export class BusCustomizationResDto {
  
  @ApiProperty({
    description: 'Number of seats added',
    example: 20
  })
  seatsAdded: number;

  @ApiProperty({
    description: 'Range of seat numbers added',
    example: '1 - 20'
  })
  seatRange: string;

  @ApiProperty({
    description: 'Floor where seats were added',
    example: 1
  })
  floor: number;

  @ApiProperty({
    description: 'Type of seats added',
    example: 'Standard'
  })
  seatType: string;
}


export class BusCustomizationArrayResDto {
  @ApiProperty({
    description: 'Array of seat configuration results',
    type: [BusCustomizationResDto]
  })
  results: BusCustomizationResDto[];

  @ApiProperty({
    description: 'Total seats added across all configurations',
    example: 45
  })
  totalSeatsAdded: number;

  @ApiProperty({
    description: 'Number of configurations processed',
    example: 3
  })
  configurationsProcessed: number;
}




