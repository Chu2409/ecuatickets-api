import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger'
import { CounterSalesService } from './counter-sale/counter-sale.service'
import { OnlineSalesService } from './online-sale/online-sale.service'
import { CreateCounterSaleDto } from './counter-sale/dto/req/create-counter-sale.dto'
import { CreateOnlineSaleDto } from './online-sale/dto/req/create-online-sale.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_ROLE } from '../users/types/user-role.enum'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { User } from '@prisma/client'
import { PAYMENT_METHOD } from './types/payment-method'
import { DatabaseService } from 'src/global/database/database.service'

@ApiTags('Ticket Sales (CLERK, CUSTOMER)')
@Controller('ticket-sales')
@ApiBearerAuth()
@Auth(USER_ROLE.CLERK, USER_ROLE.CUSTOMER)
export class TicketSaleController {
  constructor(
    private readonly counterSalesService: CounterSalesService,
    private readonly onlineSalesService: OnlineSalesService,
    private readonly prisma: DatabaseService,
  ) { }

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

  @Patch('payments/:paymentId/validate')
  @ApiOperation({
    summary: 'Validate pending payment (CLERK)',
  })
  @ApiParam({
    name: 'paymentId',
    description: 'ID del pago a validar',
    type: 'number',
  })
  @ApiQuery({
    name: 'paypalOrderId',
    description: 'ID de la orden de PayPal (requerido si el método de pago es PayPal)',
    type: 'string',
    required: false,
  })
  @Auth(USER_ROLE.CLERK)
  async validatePayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
    @Query('paypalOrderId') paypalOrderId?: string,
  ): Promise<{ message: string }> {
    // Get payment details to check payment method
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      select: { paymentMethod: true }
    })

    if (!payment) {
      throw new BadRequestException('Pago no encontrado')
    }

    // If payment method is PayPal, paypalOrderId is required
    if (payment.paymentMethod === PAYMENT_METHOD.PAYPAL && !paypalOrderId) {
      throw new BadRequestException('ID de orden de PayPal es requerido para validar pagos de PayPal')
    }

    await this.counterSalesService.validatePayment(paymentId, paypalOrderId)
    return { message: 'Pago validado exitosamente' }
  }

  @Patch('payments/:paymentId/reject')
  @ApiOperation({
    summary: 'Reject pending payment (CLERK)',
  })
  @ApiParam({
    name: 'paymentId',
    description: 'ID del pago a rechazar',
    type: 'number',
  })
  @Auth(USER_ROLE.CLERK)
  async rejectPayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ): Promise<{ message: string }> {
    await this.counterSalesService.rejectPayment(paymentId)
    return { message: 'Pago rechazado exitosamente' }
  }

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
