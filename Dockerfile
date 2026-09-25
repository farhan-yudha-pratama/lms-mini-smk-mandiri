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
# STAGE 3: Final Web Application (Nginx + Next.js)
# =================================================================
FROM node:22-alpine AS runner

# Install Nginx dan openssl
RUN apk add --no-cache openssl nginx

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
    proxy_pass http://127.0.0.1:3001; \
    proxy_http_version 1.1; \
    proxy_set_header Upgrade $http_upgrade; \
    proxy_set_header Connection "upgrade"; \
    proxy_set_header Host $host; \
    proxy_cache_bypass $http_upgrade; \
    } \
    }' > /etc/nginx/http.d/default.conf

RUN mkdir -p /run/nginx

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 80

CMD ["sh", "-c", "(npx prisma db migrate && npm start) & nginx -g 'daemon off;'"]
