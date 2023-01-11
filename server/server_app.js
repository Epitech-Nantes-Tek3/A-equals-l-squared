'use strict';

import * from "model.ts";

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

function generateJson(){
  let client = {
      host: HOST
  }

  let server = {
      current_time: Math.floor(Date.now() / 1000);,
      services: [
          {
              name: "",
              actions: [
                  {
                      name: "",
                      description: ""
                  }
              ],
              reactions: [
                  {
                      name: "",
                      description: ""
                  }
              ]
          }
      ]
  }

  let json = JSON.stringify({client, server});
  return json;
}

app.get('/about.json', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(generateJson());
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});