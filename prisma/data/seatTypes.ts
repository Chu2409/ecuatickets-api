import { Prisma } from '@prisma/client'

export const seatTypes: Prisma.SeatTypeCreateManyInput[] = [
  {
    name: 'Normal',
    description: 'Asientos normales sin características especiales',
    valueToApply: 1,
  },
  {
    name: 'VIP',
    description: 'Asientos VIP con características especiales',
    valueToApply: 1.3,
  },
  {
    name: 'Discapacitados',
    description: 'Asientos para personas con discapacidad',
    valueToApply: 0.8,
  },
]
