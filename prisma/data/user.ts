import { Prisma } from '@prisma/client'
import { USER_STATUS } from '../../src/core/users/types/user-status.enum'
import { USER_TYPE } from '../../src/core/users/types/user-type.enum'
import { hashPassword } from '../../src/common/utils/encrypter'

export const people: Prisma.PersonCreateManyInput[] = [
  {
    dni: '0707047643',
    name: 'Daniel',
    surname: 'Zhu',
    email: 'dzhu2409@gmail.com',
    birthDate: new Date('2003-09-24'),
  },
]

export const users: Prisma.UserCreateManyInput[] = [
  {
    personId: 1,
    username: 'chu2409',
    password: hashPassword('123456'),
    type: USER_TYPE.ADMINISTRATOR,
    status: USER_STATUS.ACTIVE,
  },
]
