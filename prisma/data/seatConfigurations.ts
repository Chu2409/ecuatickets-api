import { Prisma } from '@prisma/client'

export const seatConfigurations: Prisma.SeatConfigurationCreateManyInput[] = [
  {
    busId: 1,
    seatTypeId: 1,
    quantity: 48,
  },
  {
    busId: 1,
    seatTypeId: 2,
    quantity: 4,
  },
  {
    busId: 2,
    seatTypeId: 1,
    quantity: 43,
  },
  {
    busId: 2,
    seatTypeId: 2,
    quantity: 2,
  },
]
