import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      transactionOptions: {
        maxWait: 10000, // 10 segundos
        timeout: 60000, // 60 segundos
      },
    })
  }

  async onModuleInit() {
    await this.$connect()
  }
}
