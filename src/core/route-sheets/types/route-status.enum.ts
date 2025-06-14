import type { RouteStatus } from '@prisma/client'

export const ROUTE_STATUS = {
  COMPLETED: 'COMPLETED',
  IN_PROGRESS: 'IN_PROGRESS',
  GENERATED: 'GENERATED',
} as const satisfies Record<RouteStatus, RouteStatus>

export type ROUTE_STATUS = (typeof ROUTE_STATUS)[keyof typeof ROUTE_STATUS]
