FROM node:18.2.0-alpine3.15

# add `/app/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

COPY ./package.json /

RUN npm install

WORKDIR /app

#CMD ["node", "app.js"]