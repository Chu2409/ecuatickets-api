import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CounterSalesService } from './counter-sale/counter-sale.service'
import { OnlineSalesService } from './online-sale/online-sale.service'
import { CreateCounterSaleDto } from './counter-sale/dto/req/create-counter-sale.dto'
import { CreateOnlineSaleDto } from './online-sale/dto/req/create-online-sale.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_ROLE } from '../users/types/user-role.enum'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { User } from '@prisma/client'

@ApiTags('Ticket Sales (CLERK, CUSTOMER)')
@Controller('ticket-sales')
@ApiBearerAuth()
@Auth(USER_ROLE.CLERK, USER_ROLE.CUSTOMER)
export class TicketSaleController {
  constructor(
    private readonly counterSalesService: CounterSalesService,
    private readonly onlineSalesService: OnlineSalesService,
  ) {}

  @Post('counter')
  @ApiOperation({
    summary: 'Process counter sale (CLERK)',
  })
  @ApiStandardResponse(Boolean)
  @Auth(USER_ROLE.CLERK)
  async processCounterSale(
    @Body() dto: CreateCounterSaleDto,
    @GetUser() clerk: User,
  ) {
    dto.clerkId = clerk.id
    return this.counterSalesService.processCounterSale(dto)
  }

  @Post('online')
  @ApiOperation({
    summary: 'Process online sale (CUSTOMER)',
  })
  @ApiStandardResponse(Boolean)
  @Auth(USER_ROLE.CUSTOMER)
  async processOnlineSale(
    @Body() createSaleDto: CreateOnlineSaleDto,
    @GetUser() user: User,
  ) {
    createSaleDto.userId = user.id
    return this.onlineSalesService.processOnlineSale(createSaleDto)
  }

  // @Patch('payments/:paymentId/validate')
  // @ApiOperation({
  //   summary: 'Validate pending payment (CLERK)',
  // })
  // @ApiParam({
  //   name: 'paymentId',
  //   description: 'ID del pago a validar',
  //   type: 'number',
  // })
  // @Auth(USER_ROLE.CLERK)
  // async validatePayment(
  //   @Param('paymentId', ParseIntPipe) paymentId: number,
  //   @Body('clerkId') clerkId: number,
  // ): Promise<{ message: string }> {
  //   await this.counterSalesService.validatePayment(paymentId, clerkId)
  //   return { message: 'Pago validado exitosamente' }
  // }

  // @Patch('payments/:paymentId/reject')
  // @ApiOperation({
  //   summary: 'Reject pending payment (CLERK)',
  // })
  // @ApiParam({
  //   name: 'paymentId',
  //   description: 'ID del pago a rechazar',
  //   type: 'number',
  // })
  // @Auth(USER_ROLE.CLERK)
  // async rejectPayment(
  //   @Param('paymentId', ParseIntPipe) paymentId: number,
  //   @Body('clerkId', ParseIntPipe) clerkId: number,
  // ): Promise<{ message: string }> {
  //   await this.counterSalesService.rejectPayment(paymentId, clerkId)
  //   return { message: 'Pago rechazado exitosamente' }
  // }

  // @Get('customers/:customerId/tickets')
  // @ApiOperation({
  //   summary: 'Get customer tickets (CUSTOMER)',
  // })
  // @ApiParam({
  //   name: 'customerId',
  //   description: 'ID del cliente',
  //   type: 'number',
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   description: 'Número máximo de boletos a retornar',
  //   type: 'number',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'offset',
  //   description: 'Número de boletos a saltar',
  //   type: 'number',
  //   required: false,
  // })
  // async getCustomerTickets(
  //   @Param('customerId', ParseIntPipe) customerId: number,
  //   @Query('limit') limit: number = 10,
  //   @Query('offset') offset: number = 0,
  // ) {
  //   return await this.onlineSalesService.getCustomerTickets(
  //     customerId,
  //     limit,
  //     offset,
  //   )
  // }

  // @Get('tickets/:accessCode/customer/:customerId')
  // @ApiOperation({
  //   summary: 'Get ticket by access code (CUSTOMER)',
  // })
  // @ApiParam({
  //   name: 'accessCode',
  //   description: 'Código de acceso del boleto',
  //   type: 'string',
  // })
  // async getTicketByAccessCode(@Param('accessCode') accessCode: string) {
  //   return await this.onlineSalesService.getTicketByAccessCode(accessCode)
  // }
}
