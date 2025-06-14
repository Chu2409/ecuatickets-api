import type { PaymentStatus } from '@prisma/client'

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REFUNDED: 'REFUNDED',
} as const satisfies Record<PaymentStatus, PaymentStatus>

export type PAYMENT_STATUS =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]
