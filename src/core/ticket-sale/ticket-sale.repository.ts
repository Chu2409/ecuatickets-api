import { Injectable } from '@nestjs/common'
import { Prisma, PaymentStatus } from '@prisma/client'
import { DatabaseService } from 'src/global/database/database.service'

@Injectable()
export class TicketSaleRepository {
  constructor(private prisma: DatabaseService) {}

  findRouteSheetById(routeSheetId: number) {
    return this.prisma.routeSheet.findUnique({
      where: { id: routeSheetId },
      include: {
        frequency: {
          include: {
            origin: true,
            destination: true,
            company: true,
            stops: {
              include: {
                city: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
        bus: {
          include: {
            seatConfigurations: {
              include: {
                seatType: true,
              },
            },
            physicalSeats: {
              include: {
                seatType: true,
              },
            },
          },
        },
      },
    })
  }

  async findPhysicalSeatById(seatId: number) {
    return this.prisma.physicalSeat.findUnique({
      where: { id: seatId },
      include: {
        seatType: true,
        bus: true,
      },
    })
  }

  async findCityById(cityId: number) {
    return this.prisma.city.findUnique({
      where: { id: cityId },
    })
  }

  async findUserById(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    })
  }

  async findCompanyById(companyId: number) {
    return this.prisma.company.findUnique({
      where: { id: companyId },
    })
  }

  async checkSeatAvailability(
    routeSheetId: number,
    physicalSeatIds: number[],
    originId: number,
    destinationId: number,
  ) {
    // Verificar si los asientos están ocupados en el tramo solicitado
    const occupiedSeats = await this.prisma.ticket.findMany({
      where: {
        routeSheetId,
        physicalSeatId: { in: physicalSeatIds },
        status: 'ACTIVE',
        // Lógica para verificar solapamiento de rutas
        OR: [
          // Casos donde el ticket existente solapa con el nuevo tramo
          {
            AND: [
              { originId: { lte: originId } },
              { destinationId: { gte: destinationId } },
            ],
          },
          {
            AND: [
              { originId: { gte: originId } },
              { originId: { lt: destinationId } },
            ],
          },
          {
            AND: [
              { destinationId: { gt: originId } },
              { destinationId: { lte: destinationId } },
            ],
          },
        ],
      },
      select: {
        physicalSeatId: true,
      },
    })

    return occupiedSeats.map((seat) => seat.physicalSeatId)
  }

  async createPaymentWithTickets(
    paymentData: Prisma.PaymentCreateInput,
    ticketsData: Prisma.TicketCreateManyInput[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Crear el pago
      const payment = await tx.payment.create({
        data: paymentData,
        include: {
          user: true,
          company: true,
        },
      })

      // Crear los tickets asociados al pago
      const ticketsWithPaymentId = ticketsData.map((ticket) => ({
        ...ticket,
        paymentId: payment.id,
      }))

      await tx.ticket.createMany({
        data: ticketsWithPaymentId,
      })

      // Obtener los tickets creados con sus relaciones
      const tickets = await tx.ticket.findMany({
        where: { paymentId: payment.id },
        include: {
          origin: true,
          destination: true,
          physicalSeat: {
            include: {
              seatType: true,
            },
          },
          routeSheet: {
            include: {
              frequency: {
                include: {
                  origin: true,
                  destination: true,
                  company: true,
                },
              },
              bus: true,
            },
          },
        },
      })

      return {
        payment: {
          ...payment,
          tickets,
        },
      }
    })
  }

  async findTicketsByPaymentId(paymentId: number) {
    return this.prisma.ticket.findMany({
      where: { paymentId },
      include: {
        origin: true,
        destination: true,
        physicalSeat: {
          include: {
            seatType: true,
          },
        },
        payment: true,
      },
    })
  }

  async updatePaymentStatus(
    paymentId: number,
    status: PaymentStatus,
    validatedBy?: number,
  ) {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        validatedBy,
        validatedAt: status === PaymentStatus.APPROVED ? new Date() : null,
      },
    })

    const user = await this.prisma.user.findUnique({
      where: {
        id: payment.userId,
      },
    })

    return user
  }

  async findPaymentById(paymentId: number) {
    return this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        tickets: {
          include: {
            origin: true,
            destination: true,
            physicalSeat: {
              include: {
                seatType: true,
              },
            },
          },
        },
        user: true,
        company: true,
      },
    })
  }

  // Método para calcular precio base entre ciudades
  async calculateBasePriceBetweenCities(
    routeSheetId: number,
    originId: number,
    destinationId: number,
    seatTypeId: number,
  ) {
    // Lógica básica de pricing - esto debería ser más sofisticado en producción
    const routeSheet = await this.findRouteSheetById(routeSheetId)
    if (!routeSheet) return 0

    const seatType = await this.prisma.seatType.findUnique({
      where: { id: seatTypeId },
    })

    if (!seatType) return 0

    // Precio base ficticio - debería calcularse según distancia, demanda, etc.
    const basePrice = 15.0 // USD por defecto
    return basePrice * seatType.valueToApply
  }

  async findTicketsByCustomerId(
    customerId: number,
    limit: number,
    offset: number,
  ) {
    return this.prisma.ticket.findMany({
      where: {
        payment: {
          userId: customerId,
        },
      },
      include: {
        origin: true,
        destination: true,
        physicalSeat: {
          include: {
            seatType: true,
          },
        },
        payment: true,
        routeSheet: {
          include: {
            frequency: {
              include: {
                company: true,
              },
            },
            bus: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })
  }

  async findTicketByAccessCode(accessCode: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        accessCode,
      },
      include: {
        origin: true,
        destination: true,
        physicalSeat: {
          include: {
            seatType: true,
          },
        },
        payment: true,
        routeSheet: {
          include: {
            frequency: {
              include: {
                company: true,
              },
            },
            bus: true,
          },
        },
      },
    })

    if (!ticket) {
      throw new Error('Boleto no encontrado')
    }

    return ticket
  }

  async findTicketScan(ticketId: number) {
    return this.prisma.ticketScan.findFirst({
      where: { ticketId },
    })
  }

  async createTicketScan(data: { ticketId: number; userId: number }) {
    return this.prisma.ticketScan.create({
      data,
    })
  }

  async updateTicketStatus(ticketId: number, status: string) {
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    })
  }
}
