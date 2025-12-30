# container dựa trên Node.js version 20
FROM node:20-alpine  

# bắt đầu làm việc
WORKDIR /app

# file dependency vào container
COPY package*.json ./

# cài các dependency trong package.json vào container
RUN npm install

#copy toàn bộ source code vào container
COPY . .

# build => kết quả nằm trong thư mục dist/ (mặc định của nestJS)
RUN npm run build

# khai báo port mà container sẽ lắng nghe
EXPOSE 3000

# Lệnh chạy server NestJS
CMD ["node", "dist/main.js"]
