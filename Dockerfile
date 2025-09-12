FROM node:22 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN NODE_ENV=production yarn build

FROM httpd:2.4-alpine AS runner
COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/
EXPOSE 80