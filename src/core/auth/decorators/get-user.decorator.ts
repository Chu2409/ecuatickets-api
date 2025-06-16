import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { BaseUserResDto } from 'src/core/users/dto/res/user.dto'

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user as BaseUserResDto

    return data ? user?.[data] : user
  },
)
