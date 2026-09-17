import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

/**
 * Prisma 7 keeps the connection URL out of the schema file: the CLI reads it
 * from here, and the runtime gets it through the driver adapter in
 * src/lib/db/prisma.ts. One less place a credential can be committed.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
