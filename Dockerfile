FROM node:20-slim

WORKDIR /app

COPY . .

RUN npm install \
    && npm --prefix server install \
    && npm --prefix client install \
    && npm --prefix client run build

ENV NODE_ENV=production
EXPOSE 9000

CMD ["npm", "start"]
