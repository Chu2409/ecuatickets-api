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
import { USER_ROLE } from 'src/core/users/types/user-role.enum'
import { CustomConfigService } from 'src/global/config/config.service'
import { MOCK_USERS } from '../constants/mock-users'

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: CustomConfigService,
  ) {}

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

    // Development mode check
    if (this.configService.env.NODE_ENV === 'development') {
      const role = validRoles[0] as USER_ROLE // Use the first role in the array
      const mockUser = MOCK_USERS[role]

      if (!mockUser) return false

      req.user = mockUser
      return true
    }

    // Production mode - normal authentication
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
