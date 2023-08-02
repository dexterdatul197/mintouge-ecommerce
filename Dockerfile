FROM node:18-alpine3.17 as build

WORKDIR /app
COPY package.json /app

RUN apk update && apk add --no-cache git

RUN yarn install
COPY . /app
RUN yarn build

FROM nginx:1.22.1-alpine as proxy
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]