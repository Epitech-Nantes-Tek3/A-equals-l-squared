#!/bin/sh

cd ./server

npx swagger-jsdoc -d swagger.json server_app.js api/**/*.js -o swaggerdoc.json