FROM node:latest

COPY . .
RUN npm install
EXPOSE 8080
RUN npm install -g dotenv-cli
CMD ["npm", "start" ]