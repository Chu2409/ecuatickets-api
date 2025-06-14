import { Prisma } from '@prisma/client'

export const frequencySegments: Prisma.FrequencySegmentPriceCreateManyInput[] =
  [
    // Quito -> Guayaquil (Frequency 1)
    {
      frequencyId: 1,
      originId: 1, // Quito
      destinationId: 2, // Guayaquil
      price: 15.0,
    },
    {
      frequencyId: 1,
      originId: 1, // Quito
      destinationId: 6, // Durán
      price: 14.0,
    },
    {
      frequencyId: 1,
      originId: 6, // Durán
      destinationId: 2, // Guayaquil
      price: 1.0,
    },

    // Guayaquil -> Cuenca (Frequency 2)
    {
      frequencyId: 2,
      originId: 2, // Guayaquil
      destinationId: 3, // Cuenca
      price: 12.0,
    },
    {
      frequencyId: 2,
      originId: 2, // Guayaquil
      destinationId: 33, // Cañaribamba
      price: 10.0,
    },
    {
      frequencyId: 2,
      originId: 33, // Cañaribamba
      destinationId: 3, // Cuenca
      price: 2.0,
    },

    // Cuenca -> Quito (Frequency 3)
    {
      frequencyId: 3,
      originId: 3, // Cuenca
      destinationId: 1, // Quito
      price: 15.0,
    },
    {
      frequencyId: 3,
      originId: 3, // Cuenca
      destinationId: 32, // Cañar
      price: 3.0,
    },
    {
      frequencyId: 3,
      originId: 32, // Cañar
      destinationId: 1, // Quito
      price: 12.0,
    },

    // Quito -> Cuenca (Frequency 4)
    {
      frequencyId: 4,
      originId: 1, // Quito
      destinationId: 3, // Cuenca
      price: 15.0,
    },
    {
      frequencyId: 4,
      originId: 1, // Quito
      destinationId: 32, // Cañar
      price: 12.0,
    },
    {
      frequencyId: 4,
      originId: 32, // Cañar
      destinationId: 3, // Cuenca
      price: 3.0,
    },
  ]
