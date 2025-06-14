import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  Length,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator'

export class CreatePersonReqDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  @ApiProperty({
    description: 'The name of the user',
    example: 'John',
  })
  name: string

  @IsString({ message: 'surname must be a string' })
  @IsNotEmpty({ message: 'surname is required' })
  @ApiProperty({
    description: 'The surname of the user',
    example: 'Doe',
  })
  surname: string

  @IsString({ message: 'dni must be a string' })
  @Length(10, 10, {
    message: 'dni must be 10 characters long',
  })
  @ApiProperty({
    description: 'The dni of the user',
    example: '0707047643',
  })
  dni: string

  @IsEmail({}, { message: 'email must be a valid email' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The email of the person',
    example: 'john.doe@example.com',
  })
  email?: string

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'birthDate is required' })
  @ApiProperty({
    description: 'The birth date of the person',
    example: '2000-01-01',
  })
  birthDate: Date
}
