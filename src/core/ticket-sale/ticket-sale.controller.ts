import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'
import { CounterSalesService } from './counter-sale/counter-sale.service'
import { OnlineSalesService } from './online-sale/online-sale.service'
import { SaleResponseDto } from './dto/res/sales-response.dto'
import { CreateCounterSaleDto } from './counter-sale/dto/req/create-counter-sale.dto'
import { CreateOnlineSaleDto } from './online-sale/dto/req/create-online-sale.dto'
import { TicketResponseDto } from './dto/res/ticket-response-dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_ROLE } from '../users/types/user-role.enum'

@ApiTags('Ticket Sales')
@Controller('ticket-sales')
export class TicketSaleController {
  constructor(
    private readonly counterSalesService: CounterSalesService,
    private readonly onlineSalesService: OnlineSalesService,
  ) {}

  @Post('counter')
  @ApiOperation({
    summary: 'Procesar venta en ventanilla',
    description:
      'Permite a los oficinistas procesar ventas de boletos desde la ventanilla de la cooperativa',
  })
  @ApiResponse({
    status: 201,
    description: 'Venta procesada exitosamente',
    type: SaleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de venta inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Recurso no encontrado (ruta, asiento, etc.)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto - Asientos no disponibles',
  })
  @Auth(USER_ROLE.CLERK)
  async processCounterSale(
    @Body() createSaleDto: CreateCounterSaleDto,
  ): Promise<SaleResponseDto> {
    return this.counterSalesService.processCounterSale(createSaleDto)
  }

  @Post('online')
  @ApiOperation({
    summary: 'Procesar venta online',
    description:
      'Permite a los clientes comprar boletos a través de la plataforma web o móvil',
  })
  @ApiResponse({
    status: 201,
    description: 'Venta procesada exitosamente',
    type: SaleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de venta inválidos o método de pago incorrecto',
  })
  @ApiResponse({
    status: 404,
    description: 'Recurso no encontrado (ruta, asiento, etc.)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto - Asientos no disponibles',
  })
  async processOnlineSale(
    @Body() createSaleDto: CreateOnlineSaleDto,
  ): Promise<SaleResponseDto> {
    return this.onlineSalesService.processOnlineSale(createSaleDto)
  }

  @Patch('payments/:paymentId/validate')
  @ApiOperation({
    summary: 'Validar pago pendiente',
    description:
      'Permite a los oficinistas validar pagos pendientes (transferencias bancarias)',
  })
  @ApiParam({
    name: 'paymentId',
    description: 'ID del pago a validar',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Pago validado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Pago no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'El pago no está pendiente de validación',
  })
  @Auth(USER_ROLE.CLERK)
  async validatePayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
    @Body('clerkId') clerkId: number,
  ): Promise<{ message: string }> {
    await this.counterSalesService.validatePayment(paymentId, clerkId)
    return { message: 'Pago validado exitosamente' }
  }

  @Patch('payments/:paymentId/reject')
  @ApiOperation({
    summary: 'Rechazar pago pendiente',
    description: 'Permite a los oficinistas rechazar pagos pendientes',
  })
  @ApiParam({
    name: 'paymentId',
    description: 'ID del pago a rechazar',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Pago rechazado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Pago no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'El pago no está pendiente de validación',
  })
  @Auth(USER_ROLE.CLERK)
  async rejectPayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
    @Body('clerkId', ParseIntPipe) clerkId: number,
  ): Promise<{ message: string }> {
    await this.counterSalesService.rejectPayment(paymentId, clerkId)
    return { message: 'Pago rechazado exitosamente' }
  }

  @Get('customers/:customerId/tickets')
  @ApiOperation({
    summary: 'Obtener boletos del cliente',
    description:
      'Permite a los clientes consultar su historial de boletos comprados',
  })
  @ApiParam({
    name: 'customerId',
    description: 'ID del cliente',
    type: 'number',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Número máximo de boletos a retornar',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Número de boletos a saltar',
    type: 'number',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de boletos del cliente',
    type: [TicketResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  async getCustomerTickets(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return await this.onlineSalesService.getCustomerTickets(
      customerId,
      limit,
      offset,
    )
  }

  @Get('tickets/:accessCode/customer/:customerId')
  @ApiOperation({
    summary: 'Obtener boleto por código de acceso',
    description:
      'Permite obtener un boleto específico usando su código de acceso',
  })
  @ApiParam({
    name: 'accessCode',
    description: 'Código de acceso del boleto',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Información detallada del boleto',
    type: TicketResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Boleto no encontrado',
  })
  async getTicketByAccessCode(@Param('accessCode') accessCode: string) {
    return await this.onlineSalesService.getTicketByAccessCode(accessCode)
  }
}
