import { Module } from '@nestjs/common'
import { CustomConfigModule } from './global/config/config.module'
import { DatabaseModule } from './global/database/database.module'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { UsersModule } from './core/users/users.module'
import { AuthModule } from './core/auth/auth.module'
import { CompaniesModule } from './core/companies/companies.module'
import { CitiesModule } from './core/cities/cities.module'
import { BusesModule } from './core/buses/buses.module'
import { CustomizationsModule } from './core/customizations/customizations.module'

@Module({
  imports: [
    CustomConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    CompaniesModule,
    CitiesModule,
    BusesModule,
    CustomizationsModule,
  ],
  providers: [ResponseInterceptor],
})
export class AppModule {}
