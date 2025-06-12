import { Prisma } from '@prisma/client'

export const frequencies: Prisma.FrequencyCreateManyInput[] = [
  {
    time: '06:00',
    resolution: '24h',
    active: true,
    companyId: 1,
    originId: 1,
    destinationId: 2,
    createdAt: new Date('2024-06-01T06:00:00Z'),
  },
  {
    time: '09:00',
    resolution: '24h',
    active: true,
    companyId: 1,
    originId: 2,
    destinationId: 3,
    createdAt: new Date('2024-06-01T09:00:00Z'),
  },
  {
    time: '12:00',
    resolution: '24h',
    active: true,
    companyId: 1,
    originId: 3,
    destinationId: 1,
    createdAt: new Date('2024-06-01T12:00:00Z'),
  },
  {
    time: '15:00',
    resolution: '24h',
    active: true,
    companyId: 1,
    originId: 1,
    destinationId: 3,
    createdAt: new Date('2024-06-01T15:00:00Z'),
  },
]
