#!/bin/bash

# Set the port
PORT=5000

# Stop any program currently running on the set port
echo 'preparing port' $PORT '...'
fuser -k 5000/tcp

# switch directories
cd build/web/

rm -rf ./client.apk
ln -s /apk/client.apk ./client.apk
# Start the server
echo 'Server starting on port' $PORT '...'
python3 -m http.server $PORT