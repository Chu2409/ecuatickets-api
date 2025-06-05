import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { BaseUserResDto } from 'src/core/users/dto/res/user.dto'

export const GetCompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user as BaseUserResDto

    return user?.companyId
  },
)
