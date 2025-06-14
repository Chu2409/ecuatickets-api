import type { PaymentMethod } from '@prisma/client'

export const PAYMENT_METHOD = {
  CASH: 'CASH',
  TRANSFER: 'TRANSFER',
  PAYPAL: 'PAYPAL',
} as const satisfies Record<PaymentMethod, PaymentMethod>

export type PAYMENT_METHOD =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]
