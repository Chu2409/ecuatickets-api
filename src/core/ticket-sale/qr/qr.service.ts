import { HttpStatus, Injectable } from '@nestjs/common'
import * as QRCode from 'qrcode'
import { TicketSaleRepository } from '../ticket-sale.repository'
import { QrResDto } from './dto/res/qr-res.dto'
import { ValidateQrReqDto } from './dto/req/validate-qr.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'

@Injectable()
export class QrService {
  constructor(private readonly ticketSaleRepository: TicketSaleRepository) {}

  async generateQrCode(accessCode: string): Promise<QrResDto> {
    const qrCodeDataUrl = await QRCode.toDataURL(accessCode, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
    })

    return {
      qr: qrCodeDataUrl,
    }
  }

  async validateTicket(
    dto: ValidateQrReqDto,
    employeeId: number,
  ): Promise<boolean> {
    const ticket = await this.ticketSaleRepository.findTicketByAccessCode(
      dto.accessCode,
    )

    if (!ticket) {
      throw new DisplayableException(
        'El boleto no existe',
        HttpStatus.NOT_FOUND,
      )
    }

    // Verificar si el boleto está activo
    if (ticket.status !== 'ACTIVE') {
      throw new DisplayableException(
        'El boleto ya ha sido utilizado o está cancelado',
        HttpStatus.BAD_REQUEST,
      )
    }

    // Verificar si el boleto ya ha sido escaneado
    const existingScan = await this.ticketSaleRepository.findTicketScan(
      ticket.id,
    )
    if (existingScan) {
      throw new DisplayableException(
        'Este boleto ya ha sido escaneado previamente',
        HttpStatus.BAD_REQUEST,
      )
    }

    // Registrar el escaneo
    await this.ticketSaleRepository.createTicketScan({
      ticketId: ticket.id,
      userId: employeeId,
    })

    // Marcar el boleto como usado
    await this.ticketSaleRepository.updateTicketStatus(ticket.id, 'USED')

    return true
  }
}
