# syntax=docker/dockerfile:1


FROM node:21.5.0

WORKDIR /SERVER/src

COPY package.json ./

COPY . .

RUN npm install


# Expose the port that the application listens on.
EXPOSE 8000

CMD [ "npm", "run", "start" ]


# docker build . -t your-image-name : tạo image dựa trên dockerfile và đổi tên
# docker image ls : list danh sách image
# docker image rm your-image-name : xóa
# docker run --name your-container-name --env-file .env -p 8000:8000 -e port=8000 your-image-name : chạy image để thành container
# docker container ls : list danh sách image