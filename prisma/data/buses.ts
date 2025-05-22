import { Prisma } from '@prisma/client'

export const buses: Prisma.BusCreateManyInput[] = [
  {
    bodyBrand: 'Mercedes Benz',
    chassisBrand: 'Mercedes Benz',
    companyId: 1,
    internalNumber: '1234',
    licensePlate: 'ABC123',
  },
  {
    bodyBrand: 'Volvo',
    chassisBrand: 'Volvo',
    companyId: 1,
    internalNumber: '5678',
    licensePlate: 'DEF456',
  },
]
