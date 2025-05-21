import { ApiProperty } from '@nestjs/swagger'
import { PersonResDto } from 'src/core/people/dto/res/person.dto'
import { USER_TYPE } from '../../types/user-type.enum'
import { USER_STATUS } from '../../types/user-status.enum'

export class UserPersonResDto {
  @ApiProperty({
    description: 'id del usuario',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'username del usuario',
    example: 'ezhu7643',
  })
  username: string

  @ApiProperty({
    description: 'tipo de usuario',
    example: USER_TYPE.ADMINISTRATOR,
  })
  type: USER_TYPE

  @ApiProperty({
    description: 'estado del usuario',
    example: USER_STATUS.ACTIVE,
  })
  status: USER_STATUS

  @ApiProperty({
    description: 'persona asociada al usuario',
    type: PersonResDto,
  })
  person: PersonResDto
}
