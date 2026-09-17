# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Multi-stage build producing a standalone Next.js server.
#
# `output: 'standalone'` in next.config.ts means the runtime image only needs
# the traced dependencies, not the whole node_modules tree.
# ---------------------------------------------------------------------------

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/usr/local/bin
WORKDIR /app

# --------------------------------------------------------------- dependencies
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
# `npm ci` runs the postinstall hook, which generates the Prisma client.
RUN npm ci --ignore-scripts && npx prisma generate

# --------------------------------------------------------------------- build
FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# The build reads the CMS to prerender pages, so the database must be
# reachable at build time. Values baked into the client bundle (NEXT_PUBLIC_*)
# must be present here too.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN npm run build

# ------------------------------------------------------------------- runtime
FROM base AS runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Never run the server as root.
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

# Migrations and the Prisma schema travel with the image so a release can run
# `payload migrate` / `prisma migrate deploy` before the new version starts.
COPY --from=build --chown=nextjs:nodejs /app/migrations ./migrations
COPY --from=build --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
