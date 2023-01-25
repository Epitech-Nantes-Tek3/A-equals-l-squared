'use strict'

const express = require('express')
const passport = require('passport')
const database = require('./database_init')
const bodyParser = require('body-parser')
const auth = require('./passport/local')
const auth_token = require('./passport/token')
const utils = require('./utils')
const gmail = require('./services/gmail/reactions/send_email')
const jwt = require('jwt-simple')
require('dotenv').config({ path: '../database.env' })

const app = express()
app.use(bodyParser.json())

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
app.get('/about.json', async (req, res) => {
  try {
    const about = {}
    about.client = { host: req.ip }
    about.server = {
      current_time: Date.now(),
      services: []
    }
    about.server.services.push(
      await database.prisma.Service.findMany({
        select: {
          name: true,
          description: true,
          isEnable: true,
          Actions: {
            select: {
              name: true,
              description: true,
              isEnable: true
            }
          },
          Reactions: {
            select: {
              name: true,
              description: true,
              isEnable: true
            }
          }
        }
      })
    )
    res.json(about)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

/**
 * Post request to signup a new user in the database.
 * body.username -> User name
 * body.email -> User mail
 * body.password -> User password
 * An e-mail is now send to the user.
 */
app.post('/api/signup', (req, res, next) => {
  passport.authenticate('signup', { session: false }, (err, user, info) => {
    if (err) throw new Error(err)
    if (user == false) return res.json(info)
    const token = utils.generateToken(user.id)
    gmail.sendEmail(
      user.email,
      'Email Verification',
      'Thank you for you registration to our service !\nPlease go to the following link to confirm your mail : http://localhost:8080/api/mail/verification?token=' +
        token
    )
    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Account created.',
        user,
        token
      },
      statusCode: res.statusCode
    })
  })(req, res, next)
})

/**
 * Post request to login to the website.
 * body.email -> User mail
 * body.password -> User password
 */
app.post('/api/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) throw new Error(err)
    if (user == false) return res.json(info)
    const token = utils.generateToken(user.id)
    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Welcome back.',
        user,
        token
      },
      statusCode: res.statusCode
    })
  })(req, res, next)
})

/**
 * Get request use to verify e-mail address with a token
 * Link sended by e-mail
 */
app.get('/api/mail/verification', async (req, res) => {
  const token = req.query.token
  const decoded = jwt.decode(token, process.env.JWT_SECRET)
  try {
    const user = await database.prisma.User.findUnique({
      where: {
        id: decoded.id
      }
    })
    await database.prisma.User.update({
      where: {
        id: decoded.id
      },
      data: {
        mailVerification: true
      }
    })
    res.send('Email now succesfully verified !\nYou can go back to login page.')
  } catch (err) {
    console.error(err.message)
    res.status(401).send('No matching user found.')
  }
})

/**
 * Get request accessing to the user profile.
 * Need to be authentified with a token.
 */
app.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) return res.json('Invalid token')
    return res.json({ message: 'Welcome friend', user: req.user })
  }
)

/**
 * Start the node.js server at PORT and HOST variable
 */
app.listen(PORT, HOST, () => {
  console.log(`Server running...`)
})

module.exports = {
  test_example
}
