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
const { hash } = require('./utils')
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
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
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
    gmail
      .sendEmail(
        user.email,
        'Email Verification',
        'Thank you for you registration to our service !\nPlease go to the following link to confirm your mail : http://localhost:8080/api/mail/verification?token=' +
          token
      )
      .catch(_error => {
        return res.status(401).send('Invalid e-mail address.')
      })
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
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
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
 * Get request to confirm a custom action.
 * Link sended by e-mail
 * Delete -> Remove the user credentials from the database
 * ResetPassword -> Reset the current user password and set it to 'password'
 */
app.get('/api/mail/customVerification', async (req, res) => {
  const token = req.query.token
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
    const user = await database.prisma.User.findUnique({
      where: {
        id: decoded.id
      }
    })
    const processType = user.confirmProcess
    await database.prisma.User.update({
      where: {
        id: decoded.id
      },
      data: {
        confirmProcess: ''
      }
    })
    if (processType == 'Delete') {
      await database.prisma.User.delete({
        where: {
          id: decoded.id
        }
      })
    }
    if (processType == 'ResetPassword') {
      await database.prisma.User.update({
        where: {
          id: decoded.id
        },
        data: {
          password: await hash('password')
        }
      })
    }
    res.send('Operation ' + processType + ' authorized and executed.')
  } catch (err) {
    console.error(err.message)
    res.status(401).send('No matching user found.')
  }
})

/**
 * Get request to delete an account
 * Send a confirmation e-mail before deleting.
 * Need to be authentified with a token.
 */
app.get(
  '/api/user/deleteAccount',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (!req.user) return res.status(401).send('Invalid token')
    await database.prisma.User.update({
      where: {
        id: req.user.id
      },
      data: {
        confirmProcess: 'Delete'
      }
    })
    const token = utils.generateToken(req.user.id)
    gmail
      .sendEmail(
        req.user.email,
        'Confirm operation',
        'You asked to delete your account. Please confirm this operation by visiting this link : http://localhost:8080/api/mail/customVerification?token=' +
          token
      )
      .catch(_error => {
        return res.status(401).send('Invalid e-mail address.')
      })
    return res.json('Verification e-mail sended')
  }
)

/**
 * Post request to reset current password
 * Send a confrmation e-mail before reseting.
 */
app.post('/api/user/resetPassword', async (req, res, next) => {
  const user = await database.prisma.User.findFirst({
    where: { email: req.body.email }
  })
  if (!user) return res.status(400).json('No user found.')
  if (!user.mailVerification)
    return res.status(401).json('Please verifiy your e-mail address.')
  await database.prisma.User.update({
    where: {
      id: user.id
    },
    data: {
      confirmProcess: 'ResetPassword'
    }
  })
  const token = utils.generateToken(user.id)
  gmail
    .sendEmail(
      user.email,
      'Confirm operation',
      'You asked to regenerate your password. It will be set to : password\nPlease confirm this operation by visiting this link : http://localhost:8080/api/mail/customVerification?token=' +
        token
    )
    .catch(_error => {
      return res.status(401).send('Invalid e-mail address.')
    })
  return res.json('Verification e-mail sended.')
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
