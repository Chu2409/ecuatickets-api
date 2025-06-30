import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CreatePersonReqDto } from 'src/core/people/dto/req/create-person.dto'
import { Type } from 'class-transformer'

export class RegisterUserReqDto {
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

  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The isActive of the user',
    example: true,
  })
  isActive?: boolean

  @ValidateIf(() => false)
  companyId: number

  @ValidateNested()
  @Type(() => CreatePersonReqDto)
  @ApiProperty({
    description: 'The person of the user',
    type: CreatePersonReqDto,
  })
  person: CreatePersonReqDto
}
