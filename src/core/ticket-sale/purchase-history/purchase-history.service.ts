import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/global/database/database.service'

@Injectable()
export class PurchaseHistoryService {
  constructor(private prisma: DatabaseService) {}

  async getUserPurchaseHistory(userId: number) {
    return this.prisma.payment.findMany({
      where: {
        userId,
      },
      include: {
        tickets: {
          include: {
            origin: true,
            destination: true,
            routeSheet: true,
            passenger: true,
            physicalSeat: {
              include: {
                bus: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
