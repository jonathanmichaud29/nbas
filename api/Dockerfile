FROM node:18.2.0-alpine3.15

# add `/app/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

COPY ./package.json / \
  ./nodemon.json /

RUN apk add nano

RUN npm install

WORKDIR /app

#CMD ["npm", "run" "dev"]