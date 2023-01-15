'use strict';

const express = require('express');
const mysql = require("mysql");
require('dotenv').config({ path: 'database.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


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
    about.client = { host: req.ip }
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

/// MySQL request example
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

/// List a data with prisma example
app.get('/database/get/user', async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
        profile: true,
      },
    }); /// GET all the user and her relations
    res.send(allUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/// Create a data with prisma example
app.get('/database/post/user', async (req, res) => { /// ?name=alice&posts=hey&profile=bio
  try {
    await prisma.user.create({
      data: {
        name: req.query.name,
        email: req.query.name + '@prisma.io',
        posts: {
          create: { title: req.query.posts },
        },
        profile: {
          create: { bio: req.query.profile },
        },
      },
    });
    res.status(200).send("Succesfully added user.");
  } catch (err) {
    res.status(500).send(err);
  }
});

/// Update a data with Prisma example
app.get('/database/update/user/name', async (req, res) => { /// ?id=1&name=pierre
  try {
    await prisma.user.update({
      where: { id: Number(req.query.id) },
      data: { name: req.query.name },
    });
    res.status(200).send("Succesfully updated user.");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});