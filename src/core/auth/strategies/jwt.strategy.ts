import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '../types/jwt-payload.interface'
import { Request } from 'express'
import { CustomConfigService } from 'src/global/config/config.service'
import { DatabaseService } from 'src/global/database/database.service'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly configService: CustomConfigService,
  ) {
    super({
      secretOrKey: configService.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  authenticate(req: Request, options?: unknown): void {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Token not found')
    }

    super.authenticate(req, options)
  }

  async validate(payload: JwtPayload) {
    const { id } = payload
    const userFound = await this.dbService.user.findFirst({
      where: {
        id,
      },
      include: {
        person: true,
      },
      omit: {
        personId: true,
      },
    })

    if (!userFound) throw new UnauthorizedException('Token not valid')

    if (userFound.status !== USER_STATUS.ACTIVE)
      throw new UnauthorizedException('User is inactive, talk with an admin')

    return userFound
  }
}
