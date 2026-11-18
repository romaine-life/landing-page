# landing-page is a static splash served by a minimal Node+Express backend.
# Kept on Node (rather than nginx/caddy) to match the house pattern across
# every other app in the cluster (see my-homepage for the prior art).
# Stage 1: the diagrams site (React + Vite) built into static files served under /diagrams.
FROM artifacts.home.romaine.life/dockerhub/library/node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a AS diagrams-builder
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
# Its model, string-box.glb, is the npm package @romaine-life/string-box, which the build copies
# into public/; the package is read with CI's sign-in for Forgejo's packages (PIPT-32).
FROM artifacts.home.romaine.life/dockerhub/library/node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a AS string-box-builder
WORKDIR /build
ENV NPM_CONFIG_REGISTRY=https://artifacts.home.romaine.life/npm/npm/
COPY string-box/package*.json string-box/.npmrc ./
RUN --mount=type=secret,id=FORGEJO_PACKAGES_TOKEN,env=FORGEJO_PACKAGES_TOKEN npm ci
COPY string-box/ ./
RUN npm run build && test -s dist/string-box.glb

# Stage 3: runtime.
FROM artifacts.home.romaine.life/dockerhub/library/node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a

WORKDIR /app
ARG NPM_CONFIG_REGISTRY=https://artifacts.home.romaine.life/npm/npm/

# fzt-browser's files are the npm package @romaine-life/fzt-browser, which the backend serves.
COPY backend/package*.json backend/.npmrc backend/
RUN --mount=type=secret,id=FORGEJO_PACKAGES_TOKEN,env=FORGEJO_PACKAGES_TOKEN cd backend && npm install --omit=dev

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

# An entrypoint, so the image check's `--self-test` reaches the server.
ENTRYPOINT ["node", "backend/server.js"]
