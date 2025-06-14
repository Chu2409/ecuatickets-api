import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { CustomConfigService } from 'src/global/config/config.service'
import { CustomConfigModule } from 'src/global/config/config.module'

@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [
    CustomConfigModule,
    MailerModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfigService],
      useFactory: (configService: CustomConfigService) => ({
        transport: {
          host: configService.env.MAIL_HOST,
          port: 587,
          secure: false,
          tls: { rejectUnauthorized: false },
          auth: {
            user: configService.env.MAIL_USER,
            pass: configService.env.MAIL_PASS,
          },
        },
        defaults: {
          from: '"Ecuatickets facturacion exitosa" <ecuatickets72@gmail.com>',
        },
      }),
    }),
  ],
})
export class EmailModule {}
