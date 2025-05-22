import { applyDecorators, UseGuards } from '@nestjs/common'
import { RoleAuthGuard } from '../guards/role-auth.guard'
import { RoleProtected } from './role-protected.decorator'
import { AuthGuard } from '@nestjs/passport'
import { USER_ROLE } from 'src/core/users/types/user-role.enum'

export function Auth(...roles: USER_ROLE[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), RoleAuthGuard),
  )
}
