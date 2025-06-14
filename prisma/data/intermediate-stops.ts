import { Prisma } from '@prisma/client'

export const intermediateStops: Prisma.IntermediateStopCreateManyInput[] = [
  // Quito -> Guayaquil (Frequency 1)
  {
    frequencyId: 1,
    cityId: 6, // Durán
    order: 1,
  },
  {
    frequencyId: 1,
    cityId: 22, // Daule
    order: 2,
  },

  // Guayaquil -> Cuenca (Frequency 2)
  {
    frequencyId: 2,
    cityId: 33, // Cañaribamba
    order: 1,
  },
  {
    frequencyId: 2,
    cityId: 32, // Cañar
    order: 2,
  },

  // Cuenca -> Quito (Frequency 3)
  {
    frequencyId: 3,
    cityId: 32, // Cañar
    order: 1,
  },
  {
    frequencyId: 3,
    cityId: 16, // Latacunga
    order: 2,
  },

  // Quito -> Cuenca (Frequency 4)
  {
    frequencyId: 4,
    cityId: 16, // Latacunga
    order: 1,
  },
  {
    frequencyId: 4,
    cityId: 32, // Cañar
    order: 2,
  },
]
