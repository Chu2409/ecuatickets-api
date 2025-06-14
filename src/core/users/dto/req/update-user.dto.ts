import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsNumber,
  IsPositive,
  IsBoolean,
} from 'class-validator'
import { USER_ROLE } from '../../types/user-role.enum'
import { UpdatePersonReqDto } from 'src/core/people/dto/req/update-person.dto'

export class UpdateUserReqDto {
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

  @IsOptional()
  @ApiPropertyOptional({
    description: 'The person of the user',
    type: UpdatePersonReqDto,
  })
  person?: UpdatePersonReqDto
}
