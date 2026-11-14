# landing-page is a static splash served by a minimal Node+Express backend.
# Kept on Node (rather than nginx/caddy) to match the house pattern across
# every other app in the cluster (see my-homepage for the prior art).
# Stage 1: the diagrams site (React + Vite) built into static files served under /diagrams.
FROM artifacts.home.romaine.life/dockerhub/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 AS diagrams-builder
WORKDIR /build
ENV NPM_CONFIG_REGISTRY=https://artifacts.home.romaine.life/npm/npm/
COPY diagrams/package*.json ./
RUN npm ci
COPY diagrams/ ./
# The release version the sidebar shows (a local build shows dev) and the commit it links to.
ARG APP_VERSION=dev
ARG SOURCE_SHA=unknown
RUN mkdir -p public && printf '{"version":"%s","sha":"%s","deployedAt":"%s"}\n' "$APP_VERSION" "$SOURCE_SHA" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > public/version.json && npm run build

# Stage 2: the String Box board viewer (three.js + Vite), served under /string-box.
# CI downloads its model, string-box.glb, into string-box/public first.
FROM artifacts.home.romaine.life/dockerhub/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 AS string-box-builder
WORKDIR /build
ENV NPM_CONFIG_REGISTRY=https://artifacts.home.romaine.life/npm/npm/
COPY string-box/package*.json ./
RUN npm ci
COPY string-box/ ./
RUN test -s public/string-box.glb && npm run build

# Stage 3: runtime.
FROM artifacts.home.romaine.life/dockerhub/library/node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293

WORKDIR /app
ARG NPM_CONFIG_REGISTRY=https://artifacts.home.romaine.life/npm/npm/

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
