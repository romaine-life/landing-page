# landing-page is a static splash served by a minimal Node+Express backend.
# Kept on Node (rather than nginx/caddy) to match the house pattern across
# every other app in the cluster (see my-homepage for the prior art).
# Stage 1: the diagrams site (React + Vite) built into static files served under /diagrams.
FROM node:20-alpine AS diagrams-builder
WORKDIR /build
COPY diagrams/package*.json ./
RUN npm ci
COPY diagrams/ ./
ARG SOURCE_SHA=unknown
RUN mkdir -p public && printf '{"sha":"%s","deployedAt":"%s"}\n' "$SOURCE_SHA" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > public/version.json && npm run build

# Stage 2: the String Box board viewer (three.js + Vite), served under /string-box.
# CI downloads its model, string-box.glb, into string-box/public first.
FROM node:20-alpine AS string-box-builder
WORKDIR /build
COPY string-box/package*.json ./
RUN npm ci
COPY string-box/ ./
RUN test -s public/string-box.glb && npm run build

# Stage 3: runtime.
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json backend/
RUN cd backend && npm install --omit=dev

COPY backend/ backend/
COPY frontend/ frontend/
COPY --from=diagrams-builder /build/dist frontend/diagrams
COPY --from=string-box-builder /build/dist frontend/string-box

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "backend/server.js"]
