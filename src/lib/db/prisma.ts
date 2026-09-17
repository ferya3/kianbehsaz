import 'server-only'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

/**
 * One client per process, created on first use.
 *
 * Creation is lazy on purpose: route modules are imported during `next build`,
 * where no database URL is configured, and a client constructed at import time
 * would fail the build instead of the request.
 *
 * The global cache matters in development, where Next.js hot-reloads modules —
 * without it every save would open another pool and exhaust Postgres'
 * connection limit.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }

  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

  globalForPrisma.prisma = client
  return client
}
