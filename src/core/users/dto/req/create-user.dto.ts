import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator'
import { USER_TYPE } from 'src/core/users/types/user-type.enum'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'
import { CreatePersonReqDto } from 'src/core/people/dto/req/create-person.dto'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserReqDto {
  @IsString({ message: 'userName must be a string' })
  @IsNotEmpty({ message: 'userName is required' })
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  userName: string

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string

  @IsEnum(USER_TYPE)
  @IsNotEmpty({ message: 'userType is required' })
  @ApiProperty({
    description: 'The type of the user',
    enum: USER_TYPE,
    example: USER_TYPE.ADMINISTRATOR,
  })
  userType: USER_TYPE

  @IsEnum(USER_STATUS)
  @IsNotEmpty({ message: 'status is required' })
  @ApiProperty({
    description: 'The status of the user',
    enum: USER_STATUS,
    example: USER_STATUS.ACTIVE,
  })
  status: USER_STATUS

  @IsObject()
  @ValidateNested()
  @Type(() => CreatePersonReqDto)
  @ApiProperty({
    description: 'The person of the user',
    type: CreatePersonReqDto,
  })
  person: CreatePersonReqDto
}
