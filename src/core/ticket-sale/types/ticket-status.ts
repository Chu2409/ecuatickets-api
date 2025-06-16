import type { TicketStatus } from '@prisma/client'

export const TICKET_STATUS = {
  ACTIVE: 'ACTIVE',
  USED: 'USED',
  CANCELLED: 'CANCELLED',
} as const satisfies Record<TicketStatus, TicketStatus>

export type TICKET_STATUS = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS]
