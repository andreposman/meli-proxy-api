FROM node:15.6-alpine3.10

WORKDIR /src

COPY . .

RUN npm install --silent

EXPOSE 3000

CMD ["npm", "start"]