import { hashPassword } from '../../src/common/utils/encrypter'
import { Prisma } from '@prisma/client'
import { USER_ROLE } from '../../src/core/users/types/user-role.enum'

const password = hashPassword('123456')

export const users: Prisma.UserCreateManyInput[] = [
  {
    username: 'chu2409',
    password,
    dni: '0707047643',
    email: 'dzhu2409@gmail.com',
    name: 'Daniel',
    surname: 'Zhu',
    role: USER_ROLE.COMPANY,
    companyId: 1,
  },
  {
    username: 'pepito12',
    password,
    dni: '0700941503',
    email: 'pepito12@gmail.com',
    name: 'Pepito',
    surname: 'Pérez',
    role: USER_ROLE.CLERK,
    companyId: 1,
  },
  {
    username: 'juanito34',
    password,
    dni: '0703224345',
    email: 'juanito34@gmail.com',
    name: 'Juanito',
    surname: 'Gómez',
    role: USER_ROLE.DRIVER,
    companyId: 1,
  },
  {
    username: 'maria23',
    password,
    dni: '0703224337',
    email: 'maria23@gmail.com',
    name: 'María',
    surname: 'López',
    role: USER_ROLE.CUSTOMER,
  },
]
