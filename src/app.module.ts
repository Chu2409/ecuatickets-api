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
import { EmailModule } from './core/email/email.module'
import { TicketSaleModule } from './core/ticket-sale/ticket-sale.module'
import { PaypalModule } from './core/paypal/paypal.module'
import { RouteSheetsModule } from './core/route-sheets/route-sheets.module'
import { FrequenciesModule } from './core/frequencies/frequencies.module'
import { SeatTypesModule } from './core/bus-customization/seat-types/seat-types.module'
import { BusCustomizationModule } from './core/bus-customization/bus-customization.module'

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
    EmailModule,
    TicketSaleModule,
    PaypalModule,
    RouteSheetsModule,
    FrequenciesModule,
    SeatTypesModule,
    BusCustomizationModule
  ],
  providers: [ResponseInterceptor],
})
export class AppModule {}
