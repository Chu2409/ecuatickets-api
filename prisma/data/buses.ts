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
  {
    bodyBrand: 'Scania',
    chassisBrand: 'Scania',
    companyId: 1,
    internalNumber: '9012',
    licensePlate: 'GHI789',
  },
  {
    bodyBrand: 'Irizar',
    chassisBrand: 'MAN',
    companyId: 1,
    internalNumber: '3456',
    licensePlate: 'JKL012',
  },
  {
    bodyBrand: 'Marcopolo',
    chassisBrand: 'Mercedes Benz',
    companyId: 1,
    internalNumber: '7890',
    licensePlate: 'MNO345',
  },
  {
    bodyBrand: 'Ayats',
    chassisBrand: 'Volvo',
    companyId: 1,
    internalNumber: '1122',
    licensePlate: 'PQR678',
  },
]
