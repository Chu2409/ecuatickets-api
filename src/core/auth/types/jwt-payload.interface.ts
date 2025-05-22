import { USER_ROLE } from 'src/core/users/types/user-role.enum'

export class JwtPayload {
  id: number
  role: USER_ROLE
}
