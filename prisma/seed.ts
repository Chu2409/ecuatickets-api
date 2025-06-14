import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { users } from './data/user'
import { companies } from './data/companies'
import { cities } from './data/cities'
import { buses } from './data/buses'
import { seatTypes } from './data/seat-types'
import { seatConfigurations } from './data/seat-configurations'
import { physicalSeats } from './data/physical-seats'
import { frequencies } from './data/frequencies'
import { routeSheets } from './data/route-sheets'
import { people } from './data/people'
import { intermediateStops } from './data/intermediate-stops'
import { frequencySegments } from './data/frequency-segments'

const prisma = new PrismaClient()

const main = async () => {
  await prisma.company.createMany({
    data: companies,
  })

  await prisma.person.createMany({
    data: people,
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

  await prisma.intermediateStop.createMany({
    data: intermediateStops,
  })

  await prisma.frequencySegmentPrice.createMany({
    data: frequencySegments,
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
