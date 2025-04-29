import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CustomConfigModule } from './global/config/config.module'
import { DatabaseModule } from './global/database/database.module'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { UsersModule } from './core/users/users.module'

@Module({
  imports: [CustomConfigModule, DatabaseModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, ResponseInterceptor],
})
export class AppModule {}
