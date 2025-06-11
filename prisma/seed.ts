import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { users } from './data/user'
import { companies } from './data/companies'
import { cities } from './data/cities'
import { buses } from './data/buses'
import { seatTypes } from './data/seatTypes'
import { seatConfigurations } from './data/seatConfigurations'
import { physicalSeats } from './data/physicalSeats'
import { frequencies } from './data/frecuencies'
import { routeSheets } from './data/route-sheets'

const prisma = new PrismaClient()

const main = async () => {
  await prisma.company.createMany({
    data: companies,
  })

  await prisma.user.createMany({
    data: users,
  })

  await prisma.city.createMany({
    data: cities,
  })

  await prisma.bus.createMany({
    data: buses,
  })

  await prisma.seatType.createMany({
    data: seatTypes,
  })

  await prisma.seatConfiguration.createMany({
    data: seatConfigurations,
  })

  await prisma.physicalSeat.createMany({
    data: physicalSeats,
  })

  await prisma.frequency.createMany({
    data: frequencies,
  })

  await prisma.routeSheet.createMany({
    data: routeSheets,
  })

  Logger.log('Seed data created successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    Logger.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
