'use strict'

const express = require('express')
var passport = require('passport')
const database_init = require('./database_init')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());

const PORT = 8080
const HOST = '0.0.0.0'

/**
 * A basic function to demonstrate the test framework.
 * @param {*} number A basic number
 * @returns The passed number
 */
function test_example (number) {
  return number
}

/**
 * Set the header protocol to authorize Web connection
 */
app.use(function (req, res, next) {
  // Allow access request from any computers
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE,PATCH')
  res.header('Access-Control-Allow-Credentials', true)
  if ('OPTIONS' == req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
})

/**
 * Welcoming path
 */
app.get('/', (req, res) => {
  res.send('Hello World')
})

/**
 * Required subject path, send some usefull data about service
 */
app.get('/about.json', (req, res) => {
  try {
    const about = {}
    about.client = { host: req.ip }
    about.server = {
      current_time: Date.now(),
      services: []
    }
    // TODO fetch the services data from DB with the IP of the client
    res.json(about)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

/**
 * Post request to signup a new user in the database.
 * body.name -> User name
 * body.email -> User mail
 * body.password -> User password
 */
app.post('/api/signup', async (req, res) => {
  try {
    await database_init.prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }
    })
    passport.authenticate('local')(req, res, () => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json({ success: true, status: 'Registration Successful!' })
    })
  } catch (err) {
    console.log(err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.json({ err: err })
  }
})

/**
 * Start the node.js server at PORT and HOST variable
 */
app.listen(PORT, HOST, () => {
  console.log(`Server running...`)
})

module.exports = {
  test_example
}
