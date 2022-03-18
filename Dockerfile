ARG APP_KEY=48ebbecf3c8c436791985994d9ba7c73
# ================================ base ================================
FROM node:16 AS build

WORKDIR /build

# Copy all package.json files to /app
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY packages/server/package*.json ./packages/server/

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy the rest and build
COPY . .

ARG APP_KEY
ARG NODE_ENV=production
ARG DISABLE_ESLINT_PLUGIN=true
ARG REACT_APP_API_KEY=$APP_KEY

RUN npm run build:client && npm run build:server

# ================================ production ================================
FROM node:16-alpine as prod

WORKDIR /app

COPY --from=build /build/package*.json ./
COPY --from=build /build/packages/client/package*.json ./packages/client/
COPY --from=build /build/packages/server/package*.json ./packages/server/

# Copy build files
COPY --from=build /build/packages/client/build  ./packages/client/build
COPY --from=build /build/packages/server/dist  ./packages/server/dist

# Don't install devDependencies on the runner
ARG APP_KEY
ENV NODE_ENV=production \
    APP_API_KEY=$APP_KEY

RUN npm ci && \
    npm cache clean --force

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:prod"]