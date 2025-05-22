import type { UserRole } from '@prisma/client'

export const USER_ROLE = {
  CLERK: 'CLERK',
  COMPANY: 'COMPANY',
  CUSTOMER: 'CUSTOMER',
  DRIVER: 'DRIVER',
} as const satisfies Record<UserRole, UserRole>

export type USER_ROLE = (typeof USER_ROLE)[keyof typeof USER_ROLE]
