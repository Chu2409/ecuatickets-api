import { ApiProperty } from '@nestjs/swagger'
import { USER_ROLE } from '../../types/user-role.enum'
import { CompanyResDto } from 'src/core/companies/dto/res/compy.dto'
import { PersonResDto } from 'src/core/people/dto/res/person.dto'
export class BaseUserResDto {
  @ApiProperty({
    description: 'id del usuario',
    example: 1,
  })
  id: number

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

  @ApiProperty({
    description: 'The company id of the user',
    example: 1,
  })
  companyId: number | null

  @ApiProperty({
    description: 'The person of the user',
    type: PersonResDto,
  })
  person: PersonResDto
}

export class UserCompanyResDto extends BaseUserResDto {
  @ApiProperty({
    description: 'The user company',
    type: CompanyResDto,
  })
  company: CompanyResDto
}
