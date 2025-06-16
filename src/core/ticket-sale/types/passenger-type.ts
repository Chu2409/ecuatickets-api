import type { PassengerType } from '@prisma/client'

export const PASSENGER_TYPE = {
  NORMAL: 'NORMAL',
  DISABLED: 'DISABLED',
  SENIOR: 'SENIOR',
  MINOR: 'MINOR',
} as const satisfies Record<PassengerType, PassengerType>

export type PASSENGER_TYPE =
  (typeof PASSENGER_TYPE)[keyof typeof PASSENGER_TYPE]
