import { ApiProperty } from '@nestjs/swagger'
import { USER_ROLE } from '../../types/user-role.enum'
export class BaseUserResDto {
  @ApiProperty({
    description: 'id del usuario',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'The name of the user',
    example: 'John',
  })
  name: string

  @ApiProperty({
    description: 'The surname of the user',
    example: 'Doe',
  })
  surname: string

  @ApiProperty({
    description: 'The dni of the user',
    example: '0707047643',
  })
  dni: string

  @ApiProperty({
    description: 'The email of the user',
    example: 'juanito21@gmail.com',
  })
  email: string

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  username: string

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string

  @ApiProperty({
    description: 'The type of the user',
    enum: USER_ROLE,
    example: USER_ROLE.COMPANY,
  })
  role: USER_ROLE

  @ApiProperty({
    description: 'The isActive of the user',
    example: true,
  })
  isActive: boolean

  @ApiProperty({
    description: 'The created at date of the user',
    example: '2023-10-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'The updated at date of the user',
    example: '2023-10-01T00:00:00.000Z',
  })
  updatedAt: Date
}

export class UserCompanyResDto extends BaseUserResDto {
  @ApiProperty({
    description: 'The user company',
  })
  company: unknown //TODO
}
