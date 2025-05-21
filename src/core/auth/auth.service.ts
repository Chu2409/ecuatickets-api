import { HttpStatus, Injectable } from '@nestjs/common'
import { SignInReqDto } from './dto/req/sign-in.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './types/jwt-payload.interface'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { comparePassword } from 'src/common/utils/encrypter'
import { DatabaseService } from 'src/global/database/database.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ username, password }: SignInReqDto) {
    const userFound = await this.dbService.user.findFirst({
      where: {
        username,
      },
      include: {
        person: true,
      },
      omit: {
        personId: true,
      },
    })

    if (!userFound)
      throw new DisplayableException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND,
      )

    this.verifyPassword(password, userFound.password)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = userFound

    return {
      token: this.createToken({
        id: userFound.id,
        role: userFound.type,
      }),
      user: userWithoutPassword,
    }
  }

  private verifyPassword(password: string, userPassword: string) {
    const isPasswordValid = comparePassword(password, userPassword)

    if (!isPasswordValid)
      throw new DisplayableException(
        'Creedenciales incorrectas',
        HttpStatus.BAD_REQUEST,
      )

    return isPasswordValid
  }

  private readonly createToken = (payload: JwtPayload) => {
    return this.jwtService.sign(payload)
  }

  verifyToken = (token: string) => {
    try {
      return this.jwtService.verify(token)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new DisplayableException('Token inválido', HttpStatus.UNAUTHORIZED)
    }
  }
}
