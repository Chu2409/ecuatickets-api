import { PartialType } from '@nestjs/mapped-types'
import { CreateUserReqDto } from './create-user.dto'
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsString,
  IsEnum,
  IsObject,
  ValidateNested,
  IsOptional,
} from 'class-validator'
import { USER_STATUS } from '../../types/user-status.enum'
import { USER_TYPE } from '../../types/user-type.enum'

export class UpdateUserReqDto extends PartialType(
  OmitType(CreateUserReqDto, ['person']),
) {
  @IsString({ message: 'userName must be a string' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The username of the user',
    example: 'johndoe',
  })
  userName?: string

  @IsString({ message: 'password must be a string' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The password of the user',
    example: 'password',
  })
  password?: string

  @IsEnum(USER_TYPE)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The type of the user',
    enum: USER_TYPE,
    example: USER_TYPE.ADMINISTRATOR,
  })
  userType?: USER_TYPE

  @IsEnum(USER_STATUS)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The status of the user',
    enum: USER_STATUS,
    example: USER_STATUS.ACTIVE,
  })
  status?: USER_STATUS

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserReqDto)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The person of the user',
    type: UpdateUserReqDto,
  })
  person?: UpdateUserReqDto
}
