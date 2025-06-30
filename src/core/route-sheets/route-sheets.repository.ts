import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { SearchRoutesDto } from './dto/req/search-routes.dto'
import { RouteSheet } from '@prisma/client'
import { ROUTE_STATUS } from './types/route-status.enum'
import { CreateRouteSheetDto } from './dto/req/create-route-sheet'
import { RouteSheetsFiltersReqDto } from './dto/req/route-sheets-filters.dto'
import { DriverSearchRoutesDto } from './dto/req/driver-search-routes'

@Injectable()
export class RouteSheetsRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async search(searchRoutesDto: SearchRoutesDto): Promise<RouteSheet[]> {
    const { originId, destinationId, date } = searchRoutesDto

    return await this.dbService.routeSheet.findMany({
      where: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
        frequency: {
          originId,
          destinationId,
          active: true,
        },
        status: ROUTE_STATUS.GENERATED,
      },
      include: {
        frequency: {
          include: {
            company: true,
            origin: true,
            destination: true,
            segmentPrices: {
              where: {
                originId,
                destinationId,
              },
            },
          },
        },
        bus: true,
      },
      orderBy: {
        date: 'asc',
      },
    })
  }

  async getAvailableSeats(id: number) {
    const routeSheet = await this.dbService.routeSheet.findUnique({
      where: {
        id,
      },
      select: {
        busId: true,
      },
    })

    return await this.dbService.physicalSeat.findMany({
      where: {
        busId: routeSheet?.busId,
      },
      include: {
        seatType: true,
      },
      orderBy: {
        id: 'asc',
      },
    })
  }

  async findById(id: number) {
    return await this.dbService.routeSheet.findUnique({
      where: { id },
      include: {
        bus: {
          include: {
            physicalSeats: true,
          },
        },
      },
    })
  }

  async create(createRouteSheetDto: CreateRouteSheetDto) {
    return await this.dbService.routeSheet.create({
      data: createRouteSheetDto,
    })
  }

  async findMany(
    filters: RouteSheetsFiltersReqDto,
  ): Promise<[object[], number]> {
    const { limit, page } = filters

    const [entities, total] = await Promise.all([
      this.dbService.routeSheet.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          id: 'desc',
        },
        include: {
          frequency: {
            include: {
              origin: true,
              destination: true,
            },
          },
          bus: true,
        },
        omit: {
          frequencyId: true,
        },
      }),
      this.dbService.routeSheet.count({}),
    ])

    return [entities, total]
  }

  async getDriverRouteSheets(driverSearchRoutesDto: DriverSearchRoutesDto) {
    const { date } = driverSearchRoutesDto

    return await this.dbService.routeSheet.findMany({
      where: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
        driverId: driverSearchRoutesDto.driverId,
      },
      include: {
        bus: true,
        driver: true,
        frequency: true,
        tickets: {
          include: {
            origin: true,
            destination: true,
            physicalSeat: true,
            passenger: true,
          },
        },
      },
    })
  }
}
