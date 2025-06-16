import { hashPassword } from '../../src/common/utils/encrypter'
import { Prisma } from '@prisma/client'
import { USER_ROLE } from '../../src/core/users/types/user-role.enum'

const password = hashPassword('123456')

export const users: Prisma.UserCreateManyInput[] = [
  {
    username: 'chu2409',
    password,
    role: USER_ROLE.COMPANY,
    companyId: 1,
    personId: 1,
  },
  {
    username: 'pepito12',
    password,
    role: USER_ROLE.CLERK,
    companyId: 1,
    personId: 2,
  },
  {
    username: 'juanito34',
    password,
    role: USER_ROLE.DRIVER,
    companyId: 1,
    personId: 3,
  },
  {
    username: 'maria23',
    password,
    role: USER_ROLE.CUSTOMER,
    companyId: 1,
    personId: 4,
  },
  {
    username: 'admin',
    password,
    role: USER_ROLE.ADMIN,
    personId: 5,
  },
]
