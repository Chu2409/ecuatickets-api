import type { RouteMode } from '@prisma/client'

export const ROUTE_MODE = {
  AUTOMATIC: 'AUTOMATIC',
  MANUAL: 'MANUAL',
} as const satisfies Record<RouteMode, RouteMode>

export type ROUTE_MODE = (typeof ROUTE_MODE)[keyof typeof ROUTE_MODE]
