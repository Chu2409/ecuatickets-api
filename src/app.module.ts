import { Module } from '@nestjs/common'
import { CustomConfigModule } from './global/config/config.module'
import { DatabaseModule } from './global/database/database.module'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { UsersModule } from './core/users/users.module'
import { AuthModule } from './core/auth/auth.module'

@Module({
  imports: [CustomConfigModule, DatabaseModule, UsersModule, AuthModule],
  providers: [ResponseInterceptor],
})
export class AppModule {}
