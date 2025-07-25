import { HttpStatus, Injectable } from '@nestjs/common'
import { SignInReqDto } from './dto/req/sign-in.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './types/jwt-payload.interface'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { comparePassword } from 'src/common/utils/encrypter'
import { UsersService } from '../users/users.service'
import { RegisterUserReqDto } from './dto/req/register-user.dto'
import { USER_ROLE } from '../users/types/user-role.enum'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ username, password }: SignInReqDto) {
    const userFound =
      await this.usersService.findOneWithPasswordByUsername(username)

    if (!userFound)
      throw new DisplayableException(
        'Credenciales incorrectas',
        HttpStatus.NOT_FOUND,
      )

    this.verifyPassword(password, userFound.password)

    return {
      token: this.createToken({
        id: userFound.id,
        role: userFound.role,
      }),
      user: userFound,
    }
  }

  async register(dto: RegisterUserReqDto) {
    return this.usersService.create({
      ...dto,
      role: USER_ROLE.CUSTOMER,
    })
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
