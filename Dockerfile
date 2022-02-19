FROM node:16-alpine as build
WORKDIR /app/
COPY package.json yarn.lock /app/
COPY . .
RUN yarn install
RUN yarn run compile

FROM node:16-alpine as final
WORKDIR /app/
COPY package.json ./
RUN yarn --production
COPY --from=build /app/build/ /app/
CMD ["node", "/app/src/index.js"]
EXPOSE 8080

