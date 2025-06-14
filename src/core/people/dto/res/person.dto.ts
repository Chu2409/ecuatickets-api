import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PersonResDto {
  @ApiProperty({
    description: 'The id of the person',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'The name of the person',
    example: 'John',
  })
  name: string

  @ApiProperty({
    description: 'The surname of the person',
    example: 'Doe',
  })
  surname: string

  @ApiProperty({
    description: 'The dni of the person',
    example: '0707047643',
  })
  dni: string

  @ApiPropertyOptional({
    description: 'The email of the person',
    example: 'john.doe@example.com',
  })
  email: string | null

  @ApiProperty({
    description: 'The birth date of the person',
    example: '2000-01-01',
  })
  birthDate: Date
}
