import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEmail, IsOptional, IsString, IsDate } from 'class-validator'

export class UpdatePersonReqDto {
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The name of the user',
    example: 'John',
  })
  name?: string

  @IsString({ message: 'surname must be a string' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The surname of the user',
    example: 'Doe',
  })
  surname?: string

  @IsEmail({}, { message: 'email must be a valid email' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The email of the person',
    example: 'john.doe@example.com',
  })
  email?: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The birth date of the person',
    example: '2000-01-01',
  })
  birthDate?: Date
}
