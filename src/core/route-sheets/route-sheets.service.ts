import { Injectable, NotFoundException } from '@nestjs/common'
import { RouteSheetsRepository } from './route-sheets.repository'
import { SearchRoutesDto } from './dto/req/search-routes.dto'
import { ROUTE_STATUS } from './types/route-status.enum'
import { CreateRouteSheetDto } from './dto/req/create-route-sheet'
import { RouteSheetsFiltersReqDto } from './dto/req/route-sheets-filters.dto'
import { DriverSearchRoutesDto } from './dto/req/driver-search-routes'

@Injectable()
export class RouteSheetsService {
  constructor(private readonly routeSheetsRepository: RouteSheetsRepository) {}

  async search(searchRoutesDto: SearchRoutesDto) {
    return await this.routeSheetsRepository.search(searchRoutesDto)
  }

  async getAvailableSeats(id: number) {
    return await this.routeSheetsRepository.getAvailableSeats(id)
  }

  async validateAvailability(id: number, seatId?: number) {
    const routeSheet = await this.routeSheetsRepository.findById(id)

    if (!routeSheet) {
      throw new NotFoundException('Hoja de ruta no encontrada')
    }

    if (routeSheet.status !== ROUTE_STATUS.GENERATED) {
      return false
    }

    // Validar fecha
    const now = new Date()
    if (routeSheet.date < now) {
      return false
    }

    // Si se proporciona un ID de asiento, validar su disponibilidad
    if (seatId) {
      const seat = routeSheet.bus.physicalSeats.find((s) => s.id === seatId)
      if (!seat) {
        return false
      }
      if (seat.isTaken) {
        return false
      }
    }

    return true
  }

  async create(createRouteSheetDto: CreateRouteSheetDto) {
    return await this.routeSheetsRepository.create(createRouteSheetDto)
  }

  async findAll(filters: RouteSheetsFiltersReqDto) {
    const [entities, total] = await this.routeSheetsRepository.findMany(filters)

    return {
      records: entities,
      total,
      limit: filters.limit,
      page: filters.page,
      pages: Math.ceil(total / filters.limit),
    }
  }

  async getDriverRouteSheets(driverSearchRoutesDto: DriverSearchRoutesDto) {
    return await this.routeSheetsRepository.getDriverRouteSheets(
      driverSearchRoutesDto,
    )
  }
}
