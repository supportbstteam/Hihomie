# ─── Stage 1: Dependencies ───────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else echo "No lockfile found!" && exit 1; \
  fi


# ─── Stage 2: Builder ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# ✅ Set NODE_ENV BEFORE building
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ✅ Build-time only variable (NEXT_PUBLIC_* gets baked into the JS bundle)
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL

RUN npm run build


# ─── Stage 3: Runner ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ✅ Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ✅ Copy only what's needed to run the app (not the whole source)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# ✅ Uses the lightweight standalone server, not npm run start
CMD ["node", "server.js"]