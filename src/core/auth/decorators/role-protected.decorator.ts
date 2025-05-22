import { SetMetadata } from '@nestjs/common'
import { USER_ROLE } from 'src/core/users/types/user-role.enum'

export const META_ROLES = 'roles'

export const RoleProtected = (...args: USER_ROLE[]) => {
  return SetMetadata(META_ROLES, args)
}
