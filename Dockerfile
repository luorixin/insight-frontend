# FROM node:latest as build-stage

# RUN echo "--------web 环境配置 ---------"

# WORKDIR /app

# COPY ./ .
# RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

# RUN cnpm install

# RUN cnpm run build

FROM nginx:latest

RUN echo "-------web 发布 -----------"

COPY ./dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]