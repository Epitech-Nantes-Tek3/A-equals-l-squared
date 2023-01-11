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
    }  // fetch the services data from DB with the IP of the client
       // connection.query(`SELECT name,actions,reactions FROM services`,
       // function (error, results, fields) {
       //   if (error) throw error;
       //   about.server.services = results;
    res.json(about);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});