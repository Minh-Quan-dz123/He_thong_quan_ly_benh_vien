FROM node:18-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json* .
COPY src ./src
RUN npm install --production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "src/index.js"]
