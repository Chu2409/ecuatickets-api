import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger'
import { QrService } from './qr.service'
import { GetUser } from 'src/core/auth/decorators/get-user.decorator'
import { User } from '@prisma/client'
import { QrResDto } from './dto/res/qr-res.dto'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { Auth } from 'src/core/auth/decorators/auth.decorator'
import { ValidateQrReqDto } from './dto/req/validate-qr.dto'

@ApiTags('QR Codes')
@Controller('qr')
@ApiBearerAuth()
@Auth()
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get('generate/:accessCode')
  @ApiOperation({
    summary: 'Generar código QR',
    description: 'Genera un código QR para un boleto específico',
  })
  @ApiParam({
    name: 'accessCode',
    description: 'Código de acceso del boleto',
    type: 'string',
  })
  @ApiStandardResponse(QrResDto)
  async generateQrCode(@Param('accessCode') accessCode: string) {
    return await this.qrService.generateQrCode(accessCode)
  }

  @Post('validate')
  @ApiOperation({
    summary: 'Validar boleto',
    description: 'Valida un boleto mediante su código QR',
  })
  @ApiStandardResponse(Boolean)
  async validateTicket(@Body() dto: ValidateQrReqDto, @GetUser() user: User) {
    return await this.qrService.validateTicket(dto, user.id)
  }
}
