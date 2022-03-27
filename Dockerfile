# Pass some key in from the command line
# this key is exposed in the frontend and is not meant to be secret
ARG APP_KEY=48ebbecf3c8c436791985994d9ba7c73
# ================================ base ================================
FROM node:16-alpine AS build

WORKDIR /build

# Copy all package.json files to workdir
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY packages/server/package*.json ./packages/server/

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy the rest and build
COPY . .

# Setup enviroment variables for build
ARG APP_KEY
ARG NODE_ENV=production
ARG DISABLE_ESLINT_PLUGIN=true
ARG REACT_APP_API_KEY=$APP_KEY

RUN npm run build:client && npm run build:server

# ================================ production ================================
FROM node:16-alpine as prod

WORKDIR /app

# Copy all package.json files to new workdir
COPY --from=build /build/package*.json ./
COPY --from=build /build/packages/client/package*.json ./packages/client/
COPY --from=build /build/packages/server/package*.json ./packages/server/

# Copy build files
COPY --from=build /build/packages/client/build  ./packages/client/build
COPY --from=build /build/packages/server/dist  ./packages/server/dist

# Setup enviroment variables for production
ARG APP_KEY
ENV NODE_ENV=production \
    APP_API_KEY=$APP_KEY

# Don't install devDependencies on the runner
RUN npm ci && \
    npm cache clean --force

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:prod"]