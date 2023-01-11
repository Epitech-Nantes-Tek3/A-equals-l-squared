'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/about.json', (req, res) => {
  try {
    const about = {};
    about.client = {host: req.ip}
    about.server = {
      current_time: Date.now(),
      services: []
    }
    // TODO fetch the services data from DB with the IP of the client
    res.json(about);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});