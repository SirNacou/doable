# ----------
# builder stage
# use the official Bun image to compile the app. Bun is required because
# the project uses bun-specific package management and the `bun run`
# scripts defined in package.json.
# ----------
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# copy only the manifest first so that we can leverage Docker layer
# caching when dependencies don't change.
COPY package.json bun.lock* ./

# install dependencies (production only is fine for a static build)
RUN bun install --production

# copy the rest of the source code and run the build script
COPY . .

# `build` runs `vite build` which will emit both client assets under
# `dist` and, because we use the nitro plugin, the SSR/server bundle
# under `.nitro`/`dist`.  If you're not doing SSR you can safely ignore
# the extra output.
RUN bun run build

# ----------
# runner stage (SSR) – this is the default final image now.  the
# build step above produces both the client assets and a nitro-powered
# server bundle; the preview command will start a small node-like process
# to handle SSR requests.
# ----------

FROM oven/bun:1-alpine AS runner

WORKDIR /app
COPY --from=builder /app .

# pick a port; vite's preview server defaults to 4173, but 3000 is
# commonly used and matches the `dev` script.
ENV PORT=3000
EXPOSE 3000

CMD ["bun","run","start"]

# ----------
# alternate static-only image (keep for reference)
# uncomment the block below if you ever want to build a tiny nginx
# container instead of the SSR runner above.
# ----------
#
# FROM nginx:alpine AS production
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
