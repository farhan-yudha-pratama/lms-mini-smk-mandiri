# =================================================================
# STAGE 1: Dependencies
# =================================================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install

# =================================================================
# STAGE 2: Build
# =================================================================
FROM node:22-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma contract emit
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run build

# =================================================================
# STAGE 3: Final Web Application (Next.js)
# =================================================================
FROM node:22-alpine AS runner

# Install openssl untuk Prisma
RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db migrate && npm start"]
