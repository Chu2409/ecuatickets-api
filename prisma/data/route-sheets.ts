import { Prisma } from '@prisma/client'

export const routeSheets: Prisma.RouteSheetCreateManyInput[] = [
  {
    date: new Date(),
    status: 'GENERATED',
    mode: 'AUTOMATIC',
    frequencyId: 1,
    busId: 1,
    driverId: 3,
  },
  {
    date: new Date(),
    status: 'GENERATED',
    mode: 'AUTOMATIC',
    frequencyId: 2,
    busId: 2,
    driverId: 3,
  },
  {
    date: new Date(),
    status: 'GENERATED',
    mode: 'AUTOMATIC',
    frequencyId: 3,
    busId: 3,
    driverId: 3,
  },
  {
    date: new Date(),
    status: 'GENERATED',
    mode: 'AUTOMATIC',
    frequencyId: 4,
    busId: 4,
    driverId: 3,
  },
]
