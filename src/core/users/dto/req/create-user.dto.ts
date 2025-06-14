import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { USER_ROLE } from '../../types/user-role.enum'
import { CreatePersonReqDto } from 'src/core/people/dto/req/create-person.dto'
import { Type } from 'class-transformer'

export class CreateUserReqDto {
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

  @ValidateNested()
  @Type(() => CreatePersonReqDto)
  @ApiProperty({
    description: 'The person of the user',
    type: CreatePersonReqDto,
  })
  person: CreatePersonReqDto
}
