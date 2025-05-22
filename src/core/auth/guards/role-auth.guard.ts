import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  ExecutionContext,
  CanActivate,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { META_ROLES } from '../decorators/role-protected.decorator'
import { BaseUserResDto } from 'src/core/users/dto/res/user.dto'

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    )

    if (!validRoles) return true
    if (validRoles.length === 0) return true

    const req = context.switchToHttp().getRequest()
    const userReq: BaseUserResDto = req.user

    if (validRoles.includes(userReq.role as string)) return true

    throw new ForbiddenException(
      `User ${userReq.username} need a valid role: [${validRoles.join(', ')}]`,
    )
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err ?? new UnauthorizedException('Unauthorized access')
    }
    return user
  }
}
