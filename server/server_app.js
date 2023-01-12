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

app.get('/about.json', (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(`{"message": "This is a JSON response"}`);
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});