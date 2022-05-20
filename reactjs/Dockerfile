FROM node:18.2.0-alpine3.15
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY ./my-app/package.json .

RUN npm install

CMD ["npm", "start"]
