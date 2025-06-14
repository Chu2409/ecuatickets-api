import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInReqDto } from './dto/req/sign-in.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { SignInResDto } from './dto/res/sign-in-res.dto'
import { Auth } from './decorators/auth.decorator'
import { GetUser } from './decorators/get-user.decorator'
import { User } from '@prisma/client'
import { USER_ROLE } from '../users/types/user-role.enum'
import { BaseUserResDto } from '../users/dto/res/user.dto'

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
  })
  @ApiStandardResponse(SignInResDto, HttpStatus.OK)
  async login(@Body() dto: SignInReqDto) {
    return this.service.login(dto)
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get Me',
  })
  @ApiStandardResponse(BaseUserResDto, HttpStatus.OK)
  @Auth(USER_ROLE.CUSTOMER)
  getMe(@GetUser() user: User) {
    return user
  }
}
