import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { Prisma } from '@prisma/client'
import { CreateBusCustomizationReqDto } from './dto/req/create-bus-customization.dto'

@Injectable()
export class BusCustomizationRepository {
  constructor(private readonly dbService: DatabaseService) { }

  async findBusById(id: number) {
    return this.dbService.bus.findUnique({
      where: { id },
    })
  }

  async findBusByIdAndCompany(id: number, companyId: number) {
    return this.dbService.bus.findUnique({
      where: { id, companyId },
    })
  }

  async findSeatTypeById(id: number) {
    return this.dbService.seatType.findUnique({
      where: { id },
    })
  }

  async findLastSeatNumber(busId: number) {
    return this.dbService.physicalSeat.findFirst({
      where: { busId },
      orderBy: { seatNumber: 'desc' },
    })
  }

  async createSeatConfiguration(data: {
    busId: number
    seatTypeId: number
    quantity: number
  }) {
    return this.dbService.seatConfiguration.create({
      data,
    })
  }

  async createManyPhysicalSeats(
    physicalSeats: Prisma.PhysicalSeatCreateManyInput[],
  ) {
    return this.dbService.physicalSeat.createMany({
      data: physicalSeats,
    })
  }

  async findBusSeats(busId: number) {
    return this.dbService.physicalSeat.findMany({
      where: { busId },
      include: { seatType: true },
      orderBy: [{ floor: 'asc' }, { row: 'asc' }, { column: 'asc' }],
    })
  }

  async deleteBusPhysicalSeats(busId: number) {
    return this.dbService.physicalSeat.deleteMany({
      where: { busId },
    })
  }

  async deleteBusSeatConfigurations(busId: number) {
    return this.dbService.seatConfiguration.deleteMany({
      where: { busId },
    })
  }

  async findBusSeatConfigurations(busId: number) {
    return this.dbService.seatConfiguration.findMany({
      where: { busId },
      include: { seatType: true },
    })
  }

  async findBusSeatsWithTypes(busId: number) {
    return this.dbService.physicalSeat.findMany({
      where: { busId },
      include: { seatType: true },
    })
  }

  async findBusSeatsPerRowConfig(busId: number) {
    return this.dbService.physicalSeat.findFirst({
      where: { busId },
      select: {
        row: true,
        column: true,
      },
      orderBy: { row: 'asc' },
    })
  }

  async getMaxColumnsByRow(busId: number) {
    return this.dbService.physicalSeat.groupBy({
      by: ['row'],
      where: { busId },
      _max: {
        column: true,
      },
    })
  }

  async updateSeatTypeByBusAndSeatNumber(busId: number, seatNumber: string, seatTypeId: number) {
    return this.dbService.physicalSeat.updateMany({
      where: {
        busId,
        seatNumber,
      },
      data: {
        seatTypeId,
      },
    })
  }
}
