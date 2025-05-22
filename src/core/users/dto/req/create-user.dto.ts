import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { USER_ROLE } from '../../types/user-role.enum'
export class CreateUserReqDto {
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
  @IsNotEmpty({ message: 'email is required' })
  @ApiProperty({
    description: 'The email of the user',
    example: 'juanito21@gmail.com',
  })
  email: string

  @IsString({ message: 'username must be a string' })
  @IsNotEmpty({ message: 'username is required' })
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  username: string

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string

  @IsEnum(USER_ROLE)
  @IsNotEmpty({ message: 'type is required' })
  @ApiProperty({
    description: 'The type of the user',
    enum: USER_ROLE,
    example: USER_ROLE.COMPANY,
  })
  role: USER_ROLE

  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The isActive of the user',
    example: true,
  })
  isActive?: boolean

  @IsNumber({}, { message: 'companyId must be a number' })
  @IsPositive({ message: 'companyId must be a positive number' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The companyId of the user',
    example: 1,
  })
  companyId?: number
}
