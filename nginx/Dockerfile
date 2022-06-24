FROM nginx:1.21.6-alpine 

RUN apk add openssl nano
#RUN apk add openssl nano && \
#    mkdir -p /etc/nginx/ssl && \
#    openssl genrsa -out "/etc/nginx/ssl/nbas.test.key" 2048 && \
#    openssl req -new -key "/etc/nginx/ssl/nbas.test.key" -out "/etc/nginx/ssl/nbas.test.csr" -subj '/CN=nbas.test/O=nbas/C=CA' && \
#    openssl x509 -req -days 365 -in "/etc/nginx/ssl/nbas.test.csr" -signkey "/etc/nginx/ssl/nbas.test.key" -out "/etc/nginx/ssl/nbas.test.crt"
