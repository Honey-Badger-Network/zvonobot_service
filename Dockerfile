FROM node:20-slim AS frontend-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:20-slim AS production

ENV NODE_ENV=production
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

COPY server/ ./server/
COPY --from=frontend-build /app/client/dist ./client/dist

EXPOSE 9000

CMD ["node", "server/index.js"]
