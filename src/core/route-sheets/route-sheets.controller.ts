import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Body,
} from '@nestjs/common'
import { RouteSheetsService } from './route-sheets.service'
import { SearchRoutesDto } from './dto/req/search-routes.dto'
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { USER_ROLE } from '../users/types/user-role.enum'
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator'
import { CreateRouteSheetDto } from './dto/req/create-route-sheet'

@Controller('route-sheets')
@ApiTags('Route Sheets (CUSTOMER, CLERK)')
@ApiBearerAuth()
@Auth(USER_ROLE.CUSTOMER, USER_ROLE.CLERK)
export class RouteSheetsController {
  constructor(private readonly routeSheetsService: RouteSheetsService) {}

  @Get('search')
  @ApiOperation({
    summary: 'Search available routes',
  })
  @ApiStandardResponse()
  search(@Query() searchRoutesDto: SearchRoutesDto) {
    return this.routeSheetsService.search(searchRoutesDto)
  }

  @Get(':id/available-seats')
  @ApiOperation({
    summary: 'Get available seats for a route sheet',
  })
  @ApiStandardResponse()
  getAvailableSeats(@Param('id', ParseIntPipe) id: number) {
    return this.routeSheetsService.getAvailableSeats(id)
  }

  @Get(':id/validate')
  @ApiOperation({
    summary: 'Validate route sheet availability',
  })
  @ApiStandardResponse()
  validateAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Query('seatId', ParseIntPipe) seatId?: number,
  ) {
    return this.routeSheetsService.validateAvailability(id, seatId)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a route sheet',
  })
  @ApiStandardResponse()
  @ApiBody({ type: CreateRouteSheetDto })
  create(@Body() createRouteSheetDto: CreateRouteSheetDto) {
    return this.routeSheetsService.create(createRouteSheetDto)
  }
}
