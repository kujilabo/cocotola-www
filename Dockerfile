FROM node:slim as builder
WORKDIR /app
ADD . .
RUN npm install
RUN npm run-script build

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
