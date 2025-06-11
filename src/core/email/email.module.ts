import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST!,
        port: 587,
        secure: false,
        tls: { rejectUnauthorized: false },

        auth: {
          user: process.env.MAIL_USER!,
          pass: process.env.MAIL_PASS!,
        },
      },
      defaults: {
        from: '"Ecuatickets facturacion exitosa" <ecuatickets72@gmail.com>',
      },
    }),
  ],
})
export class EmailModule {}
