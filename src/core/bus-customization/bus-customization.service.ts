import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { BusCustomizationRepository } from './bus-customization.repository'
import { CreateBusCustomizationReqDto } from './dto/req/create-bus-customization.dto'
import { Prisma } from '@prisma/client'
import {
  BusCustomizationArrayResDto,
  BusCustomizationResDto,
} from './dto/res/bus-customization.dto'
import { SeatDto } from './dto/res/bus-seats.dto'
import { BUS_TYPES_CONFIG } from './bus-types.config'

@Injectable()
export class BusCustomizationService {
  private readonly SEATS_PER_ROW = 4

  constructor(private repository: BusCustomizationRepository) { }

  async addSeatsToExistingBus(
    busId: number,
    configurations: CreateBusCustomizationReqDto[],
    companyId: number,
  ): Promise<BusCustomizationArrayResDto> {
    await this.findBusByIdAndCompany(busId, companyId)

    const results: BusCustomizationResDto[] = []

    for (const singleConfig of configurations) {
      // Obtener configuración por defecto si no se pasan los parámetros
      const typeConfig = BUS_TYPES_CONFIG.find(t => t.name === singleConfig.type)
      if (!typeConfig) {
        throw new BadRequestException(`Tipo de bus '${singleConfig.type}' no es válido.`)
      }
      const totalSeats = singleConfig.seats ?? singleConfig.quantity ?? typeConfig.seats
      const floors = singleConfig.floors ?? typeConfig.floors
      const quantity = singleConfig.quantity ?? totalSeats
      const floor = singleConfig.floor ?? 1

      const seatTypeId = singleConfig.seatTypeId ?? 1;
      const seatType = await this.repository.findSeatTypeById(seatTypeId);
      if (!seatType) {
        throw new NotFoundException(
          `Tipo de asiento con el id ${seatTypeId} no encontrado`,
        );
      }

      const seatsOnFloor = await this.repository.findBusSeats(busId)
      const seatsOnSameFloor = seatsOnFloor.filter(
        (seat) => seat.floor === floor,
      )

      let nextSeatNumber = 1
      let startingRow = 1

      if (seatsOnSameFloor.length > 0) {
        const maxSeatNumber = Math.max(
          ...seatsOnSameFloor.map((seat) => parseInt(seat.seatNumber)),
        )
        nextSeatNumber = maxSeatNumber + 1

        const validRows = seatsOnSameFloor
          .filter((seat) => seat.row !== null)
          .map((seat) => seat.row as number)

        if (validRows.length > 0) {
          const maxRowOnFloor = Math.max(...validRows)
          const seatsInLastRow = seatsOnSameFloor.filter(
            (seat) => seat.row === maxRowOnFloor,
          ).length

          if (seatsInLastRow >= this.SEATS_PER_ROW) {
            startingRow = maxRowOnFloor + 1
          } else {
            startingRow = maxRowOnFloor
          }
        }
      }

      await this.repository.createSeatConfiguration({
        busId,
        seatTypeId,
        quantity,
      })

      const physicalSeats: Prisma.PhysicalSeatCreateManyInput[] = []
      let currentRow = startingRow
      let seatsInCurrentRow = 0

      if (seatsOnSameFloor.length > 0) {
        const seatsInCurrentRowOnFloor = seatsOnSameFloor.filter(
          (seat) => seat.row === currentRow,
        ).length
        seatsInCurrentRow = seatsInCurrentRowOnFloor
      }

      for (let i = 0; i < quantity; i++) {
        const column = (seatsInCurrentRow % this.SEATS_PER_ROW) + 1
        const seatNumber = nextSeatNumber.toString()
        const isVip = singleConfig.vipSeats?.includes(nextSeatNumber) ?? false

        physicalSeats.push({
          busId,
          seatTypeId,
          seatNumber,
          row: currentRow,
          column,
          floor,
          isTaken: false,
          // Puedes agregar un campo isVip si tu modelo lo soporta
          // isVip,
        })

        seatsInCurrentRow++
        nextSeatNumber++

        if (seatsInCurrentRow >= this.SEATS_PER_ROW) {
          currentRow++
          seatsInCurrentRow = 0
        }
      }

      await this.repository.createManyPhysicalSeats(physicalSeats)

      results.push({
        seatsAdded: quantity,
        seatRange: `${physicalSeats[0].seatNumber} - ${physicalSeats[physicalSeats.length - 1].seatNumber}`,
        floor,
        seatType: seatType.name,
      })
    }

    return {
      results,
      totalSeatsAdded: results.reduce(
        (sum, result) => sum + result.seatsAdded,
        0,
      ),
      configurationsProcessed: results.length,
    }
  }

  async getBusSeats(busId: number, companyId: number) {
    await this.findBusByIdAndCompany(busId, companyId)

    const seats = await this.repository.findBusSeats(busId)

    if (seats.length === 0) {
      return { message: 'Asientos no encontrados para este bus', seats: [] }
    }

    const seatsByFloor = seats.reduce(
      (acc, seat) => {
        const floor = seat.floor || 1
        if (!acc[floor]) acc[floor] = []

        const seatDto: SeatDto = {
          id: seat.id,
          seatNumber: seat.seatNumber,
          row: seat.row ?? 0,
          column: seat.column ?? 0,
          seatType: seat.seatType.name,
          isTaken: seat.isTaken,
        }

        acc[floor].push(seatDto)
        return acc
      },
      {} as Record<number, SeatDto[]>,
    )

    Object.keys(seatsByFloor).forEach((floorKey) => {
      const floor = parseInt(floorKey)
      seatsByFloor[floor].sort((a, b) => {
        if (a.row !== b.row) return (a.row || 0) - (b.row || 0)
        return (a.column || 0) - (b.column || 0)
      })
    })

    return {
      busId,
      totalSeats: seats.length,
      floors: Object.keys(seatsByFloor).length,
      seatsByFloor,
    }
  }

  async clearBusSeats(busId: number, companyId: number) {
    await this.findBusByIdAndCompany(busId, companyId)

    const deletedSeats = await this.repository.deleteBusPhysicalSeats(busId)
    const deletedConfigs =
      await this.repository.deleteBusSeatConfigurations(busId)

    return {
      success: true,
      deletedSeats: deletedSeats.count,
      deletedConfigurations: deletedConfigs.count,
    }
  }

  async getBusConfiguration(busId: number, companyId: number) {
    await this.repository.findBusByIdAndCompany(busId, companyId)
    const configurations =
      await this.repository.findBusSeatConfigurations(busId)
    const seats = await this.repository.findBusSeatsWithTypes(busId)

    const seatsByFloor = seats.reduce(
      (acc, seat) => {
        const floor = seat.floor || 1
        if (!acc[floor]) acc[floor] = []
        acc[floor].push(parseInt(seat.seatNumber))
        return acc
      },
      {} as Record<number, number[]>,
    )

    const floorInfo = Object.entries(seatsByFloor).map(([floor, seatNums]) => {
      const sorted = seatNums.sort((a, b) => a - b)
      const rows = Math.ceil(sorted.length / this.SEATS_PER_ROW)
      return {
        floor: parseInt(floor),
        seatRange: `${Math.min(...sorted)} - ${Math.max(...sorted)}`,
        totalSeats: sorted.length,
        rows,
      }
    })

    return {
      busId,
      totalSeats: seats.length,
      configurations: configurations.map((config) => ({
        seatType: config.seatType.name,
        quantity: config.quantity,
      })),
      floorInfo: floorInfo.length > 0 ? floorInfo : [],
    }
  }

  async findBusByIdAndCompany(busId: number, companyId: number) {
    const bus = await this.repository.findBusByIdAndCompany(busId, companyId)
    if (!bus) {
      throw new NotFoundException(
        `Bus con id ${busId} no encontrado o no pertenece a la compañía`,
      )
    }
    return bus
  }

  async updateSeatType(busId: number, seatNumber: string, seatTypeId: number) {
    // Verifica que el asiento exista
    const seats = await this.repository.findBusSeats(busId)
    const seat = seats.find(s => s.seatNumber === seatNumber)
    if (!seat) {
      throw new NotFoundException(`El asiento número ${seatNumber} no existe en el bus ${busId}`)
    }
    // Verifica que el tipo de asiento exista
    const seatType = await this.repository.findSeatTypeById(seatTypeId)
    if (!seatType) {
      throw new NotFoundException(`Tipo de asiento con id ${seatTypeId} no encontrado`)
    }
    await this.repository.updateSeatTypeByBusAndSeatNumber(busId, seatNumber, seatTypeId)
    return {
      success: true,
      message: `Tipo de asiento actualizado correctamente para el asiento ${seatNumber} del bus ${busId}`,
      seatNumber,
      seatType: seatType.name,
    }
  }

  async updateMultipleSeatTypes(busId: number, updates: { seatNumber: string, seatTypeId: number }[]) {
    const results: Array<{ seatNumber: string; success: boolean; message: string; seatType?: string }> = []
    for (const update of updates) {
      try {
        const res = await this.updateSeatType(busId, update.seatNumber, update.seatTypeId)
        results.push({ seatNumber: update.seatNumber, success: true, message: res.message, seatType: res.seatType })
      } catch (error) {
        results.push({ seatNumber: update.seatNumber, success: false, message: error.message })
      }
    }
    return {
      success: results.every(r => r.success),
      results,
      totalUpdated: results.filter(r => r.success).length,
      totalRequested: updates.length
    }
  }
}
