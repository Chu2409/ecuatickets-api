import { PartialType } from '@nestjs/mapped-types'
import { CreateUserReqDto } from './create-user.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsEnum,
  IsOptional,
  Length,
  IsEmail,
  IsNumber,
  IsPositive,
  IsBoolean,
} from 'class-validator'
import { USER_ROLE } from '../../types/user-role.enum'

export class UpdateUserReqDto extends PartialType(CreateUserReqDto) {
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

  @IsString({ message: 'dni must be a string' })
  @Length(10, 10, {
    message: 'dni must be 10 characters long',
  })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The dni of the user',
    example: '0707047643',
  })
  dni?: string

  @IsEmail({}, { message: 'email must be a valid email' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The email of the user',
    example: 'juanito21@gmail.com',
  })
  email?: string

  @IsString({ message: 'username must be a string' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The username of the user',
    example: 'johndoe',
  })
  username?: string

  @IsString({ message: 'password must be a string' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The password of the user',
    example: 'password',
  })
  password?: string

  @IsEnum(USER_ROLE)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The type of the user',
    enum: USER_ROLE,
    example: USER_ROLE.COMPANY,
  })
  role?: USER_ROLE

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
