'use strict';

const express = require('express');
const mysql = require("mysql");
require('dotenv').config({ path: 'database.env' });

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

// about.json route answering the client IP, the current time and the services data
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

app.get('/database', (req, res) => {
  connection.query("SELECT * FROM Student", (err, rows) => {
    if (err) {
      res.json({
        success: false,
        err,
      });
    } else {
      res.json({
        success: true,
        rows,
      });
    }
  });
});


app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});