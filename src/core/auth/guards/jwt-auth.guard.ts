import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  ExecutionContext,
  CanActivate,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { META_ROLES } from '../decorators/role-protected.decorator'
import { User } from '@prisma/client'

@Injectable()
export class JwtAuthGuard implements CanActivate {
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
    const userReq: User | null = req.user

    if (!userReq) throw new BadRequestException('User not found')

    // for (const role of userReq.userType) {
    //   if (validRoles.includes(role as string)) {
    //     return true
    //   }
    // }

    if (validRoles.includes(userReq.type as string)) return true

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
