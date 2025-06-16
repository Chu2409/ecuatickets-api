import { Injectable, NotFoundException } from '@nestjs/common'
import { PaymentStatus, Prisma, RouteSheet } from '@prisma/client'
import { DatabaseService } from 'src/global/database/database.service'
import { TICKET_STATUS } from './types/ticket-status'

export type TicketData = Omit<
  Prisma.TicketCreateManyInput,
  'passengerId' | 'paymentId'
> & {
  passengerId?: number
  passenger: {
    dni: string
    name: string
    surname: string
    email?: string
    birthDate: Date
  }
}

@Injectable()
export class TicketSaleRepository {
  constructor(private prisma: DatabaseService) { }

  async findFrequencySegmentPriceById(id: number) {
    return await this.prisma.frequencySegmentPrice.findUnique({
      where: { id },
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

  async findFrequencyById(frequencyId: number) {
    return this.prisma.frequency.findUnique({
      where: { id: frequencyId },
      include: {
        origin: true,
      },
    })
  }

  async findRouteSheet(
    frequencyId: number,
    date: Date,
  ): Promise<RouteSheet | null> {
    return this.prisma.routeSheet.findFirst({
      where: {
        frequencyId,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
    })
  }

  async findSeatById(id: number) {
    const physicalSeat = await this.prisma.physicalSeat.findUnique({
      where: { id },
      include: {
        seatType: true,
      },
    })

    return physicalSeat
  }

  async createPayment(
    tickets: TicketData[],
    paymentData: Prisma.PaymentCreateManyInput,
  ) {
    let createdPayment;
    await this.prisma.$transaction(async (tx) => {
      createdPayment = await tx.payment.create({
        data: paymentData,
      })

      for (const { passenger, ...ticket } of tickets) {
        let passengerId = ticket.passengerId;

        // Si no hay passengerId, buscar por DNI
        if (!passengerId) {
          const existingPassenger = await tx.person.findUnique({
            where: { dni: passenger.dni }
          });

          if (existingPassenger) {
            passengerId = existingPassenger.id;
          } else {
            // Si no existe, crear nuevo pasajero
            const newPassenger = await tx.person.create({
              data: {
                birthDate: passenger.birthDate,
                name: passenger.name,
                surname: passenger.surname,
                email: passenger.email,
                dni: passenger.dni,
              },
            });
            passengerId = newPassenger.id;
          }
        } else {
          // Si hay passengerId, verificar que existe
          const existingPassenger = await tx.person.findUnique({
            where: { id: passengerId }
          });

          if (!existingPassenger) {
            throw new NotFoundException(`Pasajero con ID ${passengerId} no encontrado`);
          }
        }

        // Crear el ticket con el passengerId (existente o nuevo)
        await tx.ticket.create({
          data: {
            ...ticket,
            passengerId,
            paymentId: createdPayment.id,
          },
        });
      }
    });
    return createdPayment;
  }

  async findTicketsByPaymentId(paymentId: number) {
    return this.prisma.ticket.findMany({
      where: { paymentId },
      include: {
        physicalSeat: true,
        payment: {
          include: {
            user: {
              include: {
                person: true
              }
            }
          }
        }
      },
    })
  }

  async findTicketByAccessCode(accessCode: string, userId?: number) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        accessCode,
        ...(userId && {
          payment: {
            userId,
          },
        }),
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

  async updateTicketStatus(ticketId: number, status: TICKET_STATUS) {
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    })
  }

  async updatePhysicalSeatsStatus(physicalSeats: number[]) {
    return this.prisma.physicalSeat.updateMany({
      where: { id: { in: physicalSeats } },
      data: { isTaken: true },
    })
  }

  async updatePaymentStatus(paymentId: number, status: PaymentStatus) {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
      },
      include: {
        user: {
          include: {
            person: true
          }
        }
      }
    })
  }
}
