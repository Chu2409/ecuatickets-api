import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger'
import { QrService } from './qr.service'
import { GetUser } from 'src/core/auth/decorators/get-user.decorator'
import { User } from '@prisma/client'
import { QrResDto } from './dto/res/qr-res.dto'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { Auth } from 'src/core/auth/decorators/auth.decorator'
import { ValidateQrReqDto } from './dto/req/validate-qr.dto'
import { USER_ROLE } from 'src/core/users/types/user-role.enum'

@ApiTags('QR Codes (DRIVER, CLERK, CUSTOMER)')
@Controller('qr')
@ApiBearerAuth()
@Auth(USER_ROLE.DRIVER, USER_ROLE.CLERK, USER_ROLE.CUSTOMER)
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get('generate/:accessCode')
  @ApiOperation({
    summary: 'Generate QR code (CUSTOMER)',
    description: 'Generate a QR code for a specific ticket',
  })
  @ApiParam({
    name: 'accessCode',
    description: 'Ticket access code',
    type: 'string',
  })
  @ApiStandardResponse(QrResDto)
  @Auth(USER_ROLE.CUSTOMER)
  async generateQrCode(@Param('accessCode') accessCode: string) {
    return await this.qrService.generateQrCode(accessCode)
  }

  @Post('validate')
  @ApiOperation({
    summary: 'Validate ticket (DRIVER, CLERK)',
    description: 'Validate a ticket using its QR code',
  })
  @ApiStandardResponse(Boolean)
  @Auth(USER_ROLE.DRIVER, USER_ROLE.CLERK)
  async validateTicket(@Body() dto: ValidateQrReqDto, @GetUser() user: User) {
    return await this.qrService.validateTicket(dto, user.id)
  }
}
