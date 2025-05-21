import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { people, users } from './data/user'

const prisma = new PrismaClient()

const main = async () => {
  await prisma.person.createMany({
    data: people,
  })

  await prisma.user.createMany({
    data: users,
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
