import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger'
import { Auth } from 'src/core/auth/decorators/auth.decorator'
import { USER_ROLE } from 'src/core/users/types/user-role.enum'
import { BusCustomizationService } from './bus-customization.service'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { CreateBusCustomizationReqDto } from './dto/req/create-bus-customization.dto'
import { GetCompanyId } from 'src/core/auth/decorators/get-company-id.decorator'
import {
  BusCustomizationArrayResDto,
  BusCustomizationResDto,
} from './dto/res/bus-customization.dto'
import { ClearSeatsResDto } from './dto/res/delete-bus-configuration.dto'
import { BusSeatsResDto } from './dto/res/bus-seats.dto'
import { BusConfigurationResDto } from './dto/res/bus-configuration.dto'
import { BUS_TYPES_CONFIG } from './bus-types.config'

@ApiTags('Bus Customization (COMPANY)')
@Controller('bus-customization')
@ApiBearerAuth()
@Auth(USER_ROLE.COMPANY)
export class BusCustomizationController {
  constructor(private readonly service: BusCustomizationService) { }

  @Post(':busId/add-seats')
  @ApiOperation({
    summary: 'Add seats to an existing bus',
    description:
      'Adds seats to a bus maintaining consecutive numbering and row consistency. Always accepts array of configurations',
  })
  @ApiBody({
    description: 'Array of seat configurations. Si solo se envía el campo "type", el backend usará la configuración por defecto de asientos y pisos para ese tipo. Si se envían los campos "seats", "floors" o "quantity", estos valores sobrescribirán la configuración por defecto.',
    type: [CreateBusCustomizationReqDto],
    examples: {
      single: {
        summary: 'Single configuration',
        value: [
          {
            type: 'CONVENCIONAL',
            seats: 46,
            floors: 1,
            vipSeats: [1, 2, 3],
            seatTypeId: 1,
            quantity: 46,
            floor: 1,
          },
        ],
      },
      multiple: {
        summary: 'Multiple configurations',
        value: [
          {
            type: 'DOBLE_PISO',
            seats: 36,
            floors: 2,
            vipSeats: [1, 2, 3, 4],
            seatTypeId: 1,
            quantity: 20,
            floor: 1,
          },
          {
            type: 'DOBLE_PISO',
            seats: 36,
            floors: 2,
            vipSeats: [21, 22, 23, 24],
            seatTypeId: 2,
            quantity: 16,
            floor: 2,
          },
        ],
      },
      onlyType: {
        summary: 'Solo tipo (usa configuración por defecto)',
        value: [
          {
            type: 'EJECUTIVO'
          }
        ]
      }
    },
  })
  @ApiStandardResponse(BusCustomizationArrayResDto)
  addSeatsToExistingBus(
    @Param('busId', ParseIntPipe) busId: number,
    @Body() dto: CreateBusCustomizationReqDto[],
    @GetCompanyId() companyId: number,
  ) {
    return this.service.addSeatsToExistingBus(busId, dto, companyId)
  }

  @Get(':busId/seats')
  @ApiOperation({
    summary: 'Get all seats of a bus organized by floor',
  })
  @Auth(USER_ROLE.COMPANY, USER_ROLE.CLERK)
  @ApiStandardResponse(BusSeatsResDto)
  getBusSeats(
    @Param('busId', ParseIntPipe) busId: number,
    @GetCompanyId() companyId: number,
  ) {
    return this.service.getBusSeats(busId, companyId)
  }

  @Get(':busId/configuration')
  @ApiOperation({
    summary: 'Get current bus seat configuration summary',
  })
  @Auth(USER_ROLE.COMPANY, USER_ROLE.CLERK)
  @ApiStandardResponse(BusConfigurationResDto)
  getBusConfiguration(
    @Param('busId', ParseIntPipe) busId: number,
    @GetCompanyId() companyId: number,
  ) {
    return this.service.getBusConfiguration(busId, companyId)
  }

  @Delete(':busId/seats')
  @ApiOperation({
    summary: 'Clear all seats from a bus',
    description:
      'Removes all physical seats and seat configurations from a bus for reconfiguration',
  })
  @ApiStandardResponse(ClearSeatsResDto)
  clearBusSeats(
    @Param('busId', ParseIntPipe) busId: number,
    @GetCompanyId() companyId: number,
  ) {
    return this.service.clearBusSeats(busId, companyId)
  }

  @Get('bus-types')
  getBusTypesConfig() {
    return BUS_TYPES_CONFIG;
  }

  @Post(':busId/update-seat-type')
  @ApiOperation({
    summary: 'Actualizar el tipo de asiento de uno o varios asientos de un bus',
    description: 'Permite cambiar el tipo de asiento (por ejemplo, a VIP) de uno o varios asientos de un bus, usando el número de asiento y el busId. El seatTypeId 2 suele representar asientos VIP. Se puede enviar un array de objetos para actualizar varios asientos a la vez.'
  })
  @ApiParam({
    name: 'busId',
    description: 'ID del bus',
    type: Number,
  })
  @ApiBody({
    description: 'Array de datos para actualizar el tipo de asiento. Cada objeto debe tener seatNumber y seatTypeId.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          seatNumber: { type: 'string', example: '1', description: 'Número del asiento a actualizar' },
          seatTypeId: { type: 'number', example: 2, description: 'Nuevo ID del tipo de asiento (2 para VIP)' },
        },
        required: ['seatNumber', 'seatTypeId']
      }
    },
    examples: {
      varios: {
        summary: 'Actualizar varios asientos',
        value: [
          { seatNumber: '1', seatTypeId: 2 },
          { seatNumber: '2', seatTypeId: 2 },
          { seatNumber: '3', seatTypeId: 1 }
        ]
      },
      uno: {
        summary: 'Actualizar un solo asiento',
        value: [
          { seatNumber: '1', seatTypeId: 2 }
        ]
      }
    }
  })
  async updateSeatType(
    @Param('busId', ParseIntPipe) busId: number,
    @Body() updates: { seatNumber: string, seatTypeId: number }[],
  ) {
    return this.service.updateMultipleSeatTypes(busId, updates)
  }
}
