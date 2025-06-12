import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'
import { TicketResDto } from './dto/ticket.dto'

@Injectable()
export class PurchaseHistoryService {
  constructor(private prisma: DatabaseService) {}

  async getUserPurchaseHistory(dni: string): Promise<TicketResDto> {
    // @ts-expect-error Nocheck
    return this.prisma.ticket.findMany({
      where: {
        passengerId: dni,
      },
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
                company: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getTicketDetails(dni: string, ticketId: number) {
    return this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        passengerId: dni,
      },
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
                company: true,
              },
            },
          },
        },
        payment: true,
      },
    })
  }
}
