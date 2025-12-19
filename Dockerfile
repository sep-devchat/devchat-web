FROM node:22 AS builder
RUN npm i -g bun
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN NODE_ENV=production bun run build

FROM nginx:1.25.2-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80