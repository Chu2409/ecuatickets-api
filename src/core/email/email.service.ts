import { Injectable, Logger } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, totalPaid: number, date: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Confirmación de compra - Ecuatickets',
        text: `Gracias por su compra en Ecuatickets.
              Detalles de la compra:
            - Monto total pagado: $${totalPaid.toFixed(2)}
            - Fecha de la compra: ${date}

            Este correo confirma la adquisición de su entrada para el viaje en bus en la ruta seleccionada.

            Si usted no realizó esta compra, por favor comuníquese de inmediato con nuestro centro de atención al cliente.`,
      })
      return {
        success: true,
        message: 'Correo de confirmación de compra enviado exitosamente.',
        data: {
          to,
          totalPaid,
          date,
        },
      }
    } catch (error) {
      Logger.error('Error al enviar correo:', error)
      return {
        success: false,
        message: 'Error enviando el correo de confirmación de compra.',
        error,
      }
    }
  }
}
