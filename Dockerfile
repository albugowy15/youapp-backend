FROM node:20-alpine As development
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node pnpm-lock.yaml ./

# RUN npm ci
RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .

USER node

FROM node:20-alpine As build

WORKDIR /usr/src/app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --chown=node:node package*.json ./
COPY --chown=node:node pnpm-lock.yaml ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# RUN npm run build
RUN pnpm run build

ENV NODE_ENV production

# RUN npm ci --only=production && npm cache clean --force
RUN pnpm install --prod --frozen-lockfile

USER node

FROM node:20-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
