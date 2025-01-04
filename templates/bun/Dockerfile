FROM oven/bun:1-alpine AS base

WORKDIR /app

RUN apk add --no-cache curl

# Development dependencies stage
FROM base AS install-dev
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Production dependencies stage
FROM base AS install-prod
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Development stage
FROM base AS development
COPY --from=install-dev /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=development
EXPOSE 8080

CMD ["bun", "run", "dev"]

# Production stage
FROM base AS production
COPY --from=install-prod /temp/prod/node_modules node_modules
COPY . .
ENV NODE_ENV=production
EXPOSE 8080

# Make the entrypoint script executable
RUN chmod +x /app/docker-entrypoint.sh

CMD ["/app/docker-entrypoint.sh"]

