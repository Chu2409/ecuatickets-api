import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/core/auth/decorators/auth.decorator'
import { USER_ROLE } from 'src/core/users/types/user-role.enum'
import { BusCustomizationService } from './bus-customization.service'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { CreateBusCustomizationReqDto } from './dto/req/create-bus-customization.dto'
import { CreateBusConfigurationFromTemplateDto } from './dto/req/create-bus-configuration-from-template.dto'
import { GetCompanyId } from 'src/core/auth/decorators/get-company-id.decorator'
import {
  BusCustomizationArrayResDto,
  BusCustomizationResDto,
} from './dto/res/bus-customization.dto'
import { ClearSeatsResDto } from './dto/res/delete-bus-configuration.dto'
import { BusSeatsResDto } from './dto/res/bus-seats.dto'
import { BusConfigurationResDto } from './dto/res/bus-configuration.dto'

@ApiTags('Bus Customization (COMPANY)')
@Controller('bus-customization')
@ApiBearerAuth()
@Auth(USER_ROLE.COMPANY)
export class BusCustomizationController {
  constructor(private readonly service: BusCustomizationService) {}

  // @Post(':busId/add-seats')
  // @ApiOperation({
  //   summary: 'Add seats to an existing bus',
  //   description:
  //     'Adds seats to a bus maintaining consecutive numbering and row consistency. Always accepts array of configurations',
  // })
  // @ApiBody({
  //   description: 'Array of seat configurations',
  //   type: [CreateBusCustomizationReqDto],
  //   examples: {
  //     single: {
  //       summary: 'Single configuration',
  //       value: [
  //         {
  //           seatTypeId: 1,
  //           quantity: 20,
  //           floor: 1,
  //         },
  //       ],
  //     },
  //     multiple: {
  //       summary: 'Multiple configurations',
  //       value: [
  //         {
  //           seatTypeId: 1,
  //           quantity: 20,
  //           floor: 1,
  //         },
  //         {
  //           seatTypeId: 2,
  //           quantity: 10,
  //           floor: 2,
  //         },
  //       ],
  //     },
  //   },
  // })
  // @ApiStandardResponse(BusCustomizationArrayResDto)
  // addSeatsToExistingBus(
  //   @Param('busId', ParseIntPipe) busId: number,
  //   @Body() dto: CreateBusCustomizationReqDto[],
  //   @GetCompanyId() companyId: number,
  // ) {
  //   return this.service.addSeatsToExistingBus(busId, dto, companyId)
  // }

  @Post('configure-from-template')
  @ApiOperation({
    summary: 'Configure bus seats using a template',
    description:
      'Configures all seats of a bus using a predefined template and seat type assignments',
  })
  @ApiBody({
    description: 'Bus configuration from template',
    type: CreateBusConfigurationFromTemplateDto,
    examples: {
      example: {
        summary: 'Example configuration',
        value: {
          templateId: 1,
          busId: 1,
          seatTypeConfigurations: [
            {
              seatTypeId: 1,
              seatNumbers: ['1A', '1B', '2A', '2B', '3A', '3B'],
            },
            {
              seatTypeId: 2,
              seatNumbers: ['4A', '4B', '5A', '5B'],
            },
          ],
        },
      },
    },
  })
  @ApiStandardResponse(BusCustomizationArrayResDto)
  configureBusFromTemplate(
    @Body() dto: CreateBusConfigurationFromTemplateDto,
    @GetCompanyId() companyId: number,
  ) {
    return this.service.configureBusFromTemplate(dto, companyId)
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
}
