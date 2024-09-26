FROM node:20-slim

WORKDIR /usr/src/app

# Install OpenSSL and other necessary packages
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm install

COPY . .

# Prisma client
RUN npm run prisma:generate

EXPOSE 9090

# We'll run migrations and start the app in the docker-compose command
CMD ["npm", "run", "start:dev"]