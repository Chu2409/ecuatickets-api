import { ApiProperty } from "@nestjs/swagger"


export class SeatTypeResDto {

    @ApiProperty({
        description: 'Unique identifier for the seat type',
        example: 1
      })    
        id: number

    @ApiProperty({
        description: 'Name of the seat type',
        example: 'Economy'
      })
      name: string
    
      @ApiProperty({
        description: 'Description of the seat type',
        example: 'Standard economy class seat with basic amenities'
      })
      description?: string | null
    
      
      @ApiProperty({
        description: 'Value to apply for the seat type',
        example: 150.5
      })
      valueToApply: number
    
   
}