#!/bin/bash

if [ $IS_MIGRATION == false ]
then
    npm start
else
    npm run migration
    npm start
fi