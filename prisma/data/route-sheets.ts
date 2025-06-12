import { Prisma } from '@prisma/client'

export const routeSheets: Prisma.RouteSheetCreateManyInput[] = [
  {
    date: new Date('2024-06-01T06:00:00Z'),
    status: 'GENERATED',
    mode: 'AUTOMATIC',
    frequencyId: 1,
    busId: 1,
  },
  {
    date: new Date('2024-06-01T08:00:00Z'),
    status: 'GENERATED',
    mode: 'AUTOMATIC',
    frequencyId: 2,
    busId: 2,
  },
  {
    date: new Date('2024-06-01T10:00:00Z'),
    status: 'GENERATED',
    mode: 'AUTOMATIC',
    frequencyId: 3,
    busId: 3,
  },
  {
    date: new Date('2024-06-01T12:00:00Z'),
    status: 'GENERATED',
    mode: 'AUTOMATIC',
    frequencyId: 4,
    busId: 4,
  },
]
