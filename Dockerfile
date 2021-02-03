FROM node:15.6-alpine3.10

WORKDIR /src

COPY package.json .

RUN npm install --silent

COPY . .

EXPOSE 3000

CMD ["npm", "start"]