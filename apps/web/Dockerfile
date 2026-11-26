# ── stage 1: install deps ──────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /repo

# Copy workspace manifests first (better layer caching)
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

# Install all workspace deps
RUN npm ci --ignore-scripts

# ── stage 2: build ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY . .

# Ensure public directory exists
RUN mkdir -p /repo/apps/web/public

# Provide env vars that Next.js needs at build time
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb://mongo:27017/autorecruit
ENV AI_SERVICE_URL=http://ai:8000
ENV AI_SERVICE_SECRET=change-me-ai-service-secret
ENV NEXTAUTH_SECRET=change-me-to-a-long-random-string
ENV AUTH_SECRET=change-me-to-a-long-random-string
ENV NEXTAUTH_URL=http://localhost:3000

WORKDIR /repo/apps/web
RUN npm run build

# ── stage 3: minimal runtime image ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy standalone build output and static assets (both root and apps/web paths for compatibility)
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./.next/static
COPY --from=builder /repo/apps/web/public ./apps/web/public
COPY --from=builder /repo/apps/web/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "-c", "if [ -f ./apps/web/server.js ]; then node apps/web/server.js; else node server.js; fi"]
