# =========================
# 1️⃣ deps
# =========================
FROM node:24-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# =========================
# 2️⃣ build
# =========================
FROM node:24-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# =========================
# 3️⃣ runner (prod)
# =========================
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# создаём непривилегированного юзера
RUN addgroup --system --gid 1001 nextjs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]