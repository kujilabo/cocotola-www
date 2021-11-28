FROM node:slim as builder
WORKDIR /app
COPY . .
RUN npm install && \
    npm run-script build

FROM nginx:1.21.4
COPY --from=builder /app/build /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

RUN groupadd -r docker && useradd -r -g docker docker && \
    chown -R docker: /var/cache/nginx \
    && chmod -R g+w /var/cache/nginx

USER docker

EXPOSE 8080

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
