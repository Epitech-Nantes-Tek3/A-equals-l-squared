'use strict'

/** @module route */

const express = require('express')
const passport = require('passport')
const database = require('./database_init')
const bodyParser = require('body-parser')
const session = require('express-session')
const auth = require('./passport/local')
const auth_token = require('./passport/token')
const auth_google = require('./passport/google')
const auth_facebook = require('./passport/facebook')
const utils = require('./utils')
const gmail = require('./services/gmail/reactions/send_email')
const jwt = require('jwt-simple')
const { hash } = require('./utils')
const axios = require('axios')
require('dotenv').config({ path: '../database.env' })

const onMessage = require('./services/discord/actions/on_message')
const onVoiceChannel = require('./services/discord/actions/on_join_voice_channel')
const onReactionAdd = require('./services/discord/actions/on_reaction_add')
const onMemberJoining = require('./services/discord/actions/on_member_joining')
const discordClient = require('./services/discord/init')
const deezer = require('./services/deezer/init')
const { createDeezerService } = require('./services/deezer/init')
const getUserPlaylists = require('./services/deezer/getters/user_playlists')
const { createGmailService } = require('./services/gmail/gmail_init')
const { createCalendarService } = require('./services/calendar/calendar_init')
const { createDiscordService } = require('./services/discord/init')
const getVoiceChannels = require('./services/discord/getters/voice_channels')
const getTextChannels = require('./services/discord/getters/text_channels')
const getAvailableGuilds = require('./services/discord/getters/available_guilds')
const getAvailableCalendars = require('./services/calendar/getters/get_available_calendars')
const { createTimeTimeService } = require('./services/timetime/init')
const {
  TriggerInitMap,
  TriggerDestroyMap
} = require('./services/timetime/init')
const { createReaaaaaaaService } = require('./services/reaaaaaaa/init')

const app = express()

const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'A=L² API',
      version: '1.0.0',
      description: 'API for A=L² Area Epitech project',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
    tags: [
      {
        name: 'About',
        description: 'About the A=L² project',
      },
      {
        name: 'User',
        description: 'User management',
      },
      {
        name: 'Authentification',
        description: 'Authentification management',
      },
      {
        name: 'Services',
        description: 'Service management',
        children: [
          {
            name: 'Gmail',
            description: 'Gmail management',
          },
          {
            name: 'Discord',
            description: 'Discord management',
          },
          {
            name: 'Calendar',
            description: 'Calendar management',
          },
          {
            name: 'Deezer',
            description: 'Deezer management',
          }
        ]
      },
    ],
    host: 'localhost:8080',
    basePath: '/',
  },
  consumes: ['application/json'],
  produces: ['application/json'],
  apis: ['server_app.js'], // The file that contains your routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  done(null, { id: id })
})

app.use(bodyParser.json())
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.set('json spaces', 2)

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
 * @memberof route
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
 * @memberof route
 * @function
 * @name welcomingPath
 */
app.get('/', (req, res) => {
  res.send('Hello World')
})

/**
 * @swagger
 * /about.json:
 *  get:
 *    tags: [About]
 *    summary: Get info about server and services
 *    responses:
 *      200:
 *        description: OK
 *      500:
 *        description: Internal server error
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
            select: { name: true, description: true, isEnable: true }
          },
          Reactions: {
            select: { name: true, description: true, isEnable: true }
          }
        }
      })
    )
    res.header('Content-Type', 'application/json')
    res.type('json').send(JSON.stringify(about, null, 2) + '\n');
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

/**
 * @swagger
 * /api/signup:
 *  post:
 *    tags: [User]
 *    description: Sign up a new user in the database
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      201:
 *        description: User created
 *      400:
 *        description: Bad request
 */
app.post('/api/signup', (req, res, next) => {
  passport.authenticate('signup', { session: false }, (err, user, info) => {
    if (err) throw new Error(err)
    if (user == false) return res.json(info)
    const token = utils.generateToken(user.id)
    gmail
      .sendEmail(
        'aequallsquared@gmail.com',
        user.email,
        'Email Verification',
        'Thank you for you registration to our service !\nPlease go to the following link to confirm your mail : http://localhost:8080/api/mail/verification?token=' +
          token
      )
      .catch(_error => {
        return
      })
    return res.status(201).json({
      status: 'success',
      statusCode: res.statusCode
    })
  })(req, res, next)
})

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [User]
 *     description: Login an existing user with username and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *           example:
 *             username: testuser
 *             password: testpassword
 *     responses:
 *       201:
 *         description: Successfully logged in
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [success]
 *             data:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome back.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: testuser
 *                     email:
 *                       type: string
 *                       example: testuser@example.com
 *                     mailVerification:
 *                       type: boolean
 *                       example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *       400:
 *         description: Bad request
 */
app.post('/api/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) throw new Error(err)
    if (user == false) return res.json(info)
    const token = utils.generateToken(user.id)
    return res.status(201).json({
      status: 'success',
      data: { message: 'Welcome back.', user, token },
      statusCode: res.statusCode
    })
  })(req, res, next)
})

/**
 * @swagger
 * /api/mail/verification:
 *   get:
 *     tags: [User]
 *     description: Verify user email from email link
 *     produces:
 *       - text/plain
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         type: string
 *         description: JWT token received in email link
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     responses:
 *       200:
 *         description: Email verified
 *         type: string
 *       401:
 *         description: No matching user found
 */
app.get('/api/mail/verification', async (req, res) => {
  const token = req.query.token
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
    const user = await database.prisma.User.findUnique({
      where: { id: decoded.id }
    })
    await database.prisma.User.update({
      where: { id: decoded.id },
      data: { mailVerification: true }
    })
    res.send(
      'Email now successfully verified !\nYou can go back to login page.'
    )
  } catch (err) {
    console.error(err.message)
    res.status(401).send('No matching user found.')
  }
})

/**
 * @swagger
 * /api/mail/customVerification:
 *   get:
 *     tags: [User]
 *     description: Execute custom verification operation based on user's `confirmProcess` value
 *     produces:
 *       - text/plain
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         type: string
 *         description: JWT token received in email link
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     responses:
 *       200:
 *         description: Operation authorized and executed
 *         type: string
 *       401:
 *         description: No matching user found
 */
app.get('/api/mail/customVerification', async (req, res) => {
  const token = req.query.token
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
    const user = await database.prisma.User.findUnique({
      where: { id: decoded.id }
    })
    const processType = user.confirmProcess
    await database.prisma.User.update({
      where: { id: decoded.id },
      data: { confirmProcess: '' }
    })
    if (processType == 'Delete') {
      await database.prisma.User.delete({ where: { id: decoded.id } })
    }
    if (processType == 'ResetPassword') {
      await database.prisma.User.update({
        where: { id: decoded.id },
        data: { password: await hash('password') }
      })
    }
    res.send('Operation ' + processType + ' authorized and executed.')
  } catch (err) {
    console.error(err.message)
    res.status(401).send('No matching user found.')
  }
})

/**
 * @swagger
 * /api/user/deleteAccount:
 *   get:
 *     tags: [User]
 *     summary: Delete user account
 *     description: Deletes the user account with the authenticated user's ID, after sending a confirmation email to the user's email address.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A success message indicating that the confirmation email has been sent.
 *       '401':
 *         description: Unauthorized access, when the authentification token is invalid or missing.
 *       '500':
 *         description: Internal server error, when the database query or email sending fails.
 */
app.get(
  '/api/user/deleteAccount',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (!req.user) return res.status(401).send('Invalid token')
    await database.prisma.User.update({
      where: { id: req.user.id },
      data: { confirmProcess: 'Delete' }
    })
    const token = utils.generateToken(req.user.id)
    gmail
      .sendEmail(
        'aequallsquared@gmail.com',
        req.user.email,
        'Confirm operation',
        'You asked to delete your account. Please confirm this operation by visiting this link : http://localhost:8080/api/mail/customVerification?token=' +
          token
      )
      .catch(_error => {
        return
      })
    return res.json('Verification e-mail sended')
  }
)

/**
 * @swagger
 * /api/user/resetPassword:
 *   post:
 *     summary: Request to reset user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: example@example.com
 *     responses:
 *       200:
 *         description: Verification e-mail sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Verification e-mail sent.
 *       400:
 *         description: No user found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: No user found.
 *       401:
 *         description: Please verify your e-mail address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Please verify your e-mail address.
 */
app.post('/api/user/resetPassword', async (req, res, next) => {
  const user = await database.prisma.User.findFirst({
    where: { email: req.body.email }
  })
  if (!user) return res.status(400).json('No user found.')
  if (!user.mailVerification)
    return res.status(401).json('Please verify your e-mail address.')
  await database.prisma.User.update({
    where: { id: user.id },
    data: { confirmProcess: 'ResetPassword' }
  })
  const token = utils.generateToken(user.id)
  gmail
    .sendEmail(
      'aequallsquared@gmail.com',
      user.email,
      'Confirm operation',
      'You asked to regenerate your password. It will be set to : password\nPlease confirm this operation by visiting this link : http://localhost:8080/api/mail/customVerification?token=' +
        token
    )
    .catch(_error => {
      return
    })
  return res.json('Verification e-mail sent.')
})

/**
 * @swagger
 * /api/user/updateData:
 *   post:
 *     tags: [User]
 *     summary: Updates the authenticated user's username, email, and password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: johndoe123
 *               email: johndoe@example.com
 *               password: newpassword
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Your informations have been successfully updated."
 *       400:
 *         description: Incomplete request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Please pass a complete body."
 *       401:
 *         description: Invalid token or email not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Please verify your e-mail address."
 */
app.post(
  '/api/user/updateData',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    if (!req.user) return res.status(401).send('Invalid token')
    try {
      if (req.user.email != req.body.email) {
        const token = utils.generateToken(req.user.id)
        gmail
          .sendEmail(
            'aequallsquared@gmail.com',
            req.body.email,
            'Email Verification',
            'You have updated your e-mail, please go to the following link to confirm your new mail address : http://localhost:8080/api/mail/verification?token=' +
              token
          )
          .catch(_error => {
            return
          })
        await database.prisma.User.update({
          where: { id: req.user.id },
          data: { mailVerification: false }
        })
      }
      await database.prisma.User.update({
        where: { id: req.user.id },
        data: {
          username: req.body.username,
          email: req.body.email,
          password: await hash(req.body.password)
        }
      })
      return res.json('Your informations have been successfully updated.')
    } catch (err) {
      return res.status(400).json('Please pass a complete body.')
    }
  }
)

/**
 * @swagger
 * /api/login/google:
 *   post:
 *     tags: [Authentification]
 *     summary: Login with Google
 *     description: This endpoint allows users to login with Google.
 *     requestBody:
 *       description: User data required for Google authentification
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Google ID token
 *                 example: "googleidtoken"
 *               displayName:
 *                 type: string
 *                 description: User's display name on Google
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: User's email on Google
 *                 example: "johndoe@gmail.com"
 *     responses:
 *       '201':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                   description: Status of the response
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxNjU2NzgxNiwiZXhwIjoxNjE2NjU0MjE2fQ.yikUO_lFV6pRvBVJXQcHbGmzWg3qJvRu1zc4V7dymlw"
 *                       description: JSON Web Token (JWT) used for authentification
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                   description: HTTP status code of the response
 *       '401':
 *         description: Google authentification failed
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Google auth failed."
 *               description: Error message
 */
app.post('/api/login/google', async (req, res, next) => {
  try {
    let user = await database.prisma.user.findUnique({
      where: { googleId: req.body.id }
    })
    if (user) {
      const token = utils.generateToken(user.id)
      return res.status(201).json({
        status: 'success',
        data: {
          user,
          token
        },
        statusCode: res.statusCode
      })
    }
    const oldUser = await database.prisma.user.findUnique({
      where: { email: req.body.email }
    })
    if (oldUser) {
      user = await database.prisma.user.update({
        where: { email: req.body.email },
        data: { googleId: req.body.id }
      })
      const token = utils.generateToken(user.id)
      return res.status(201).json({
        status: 'success',
        data: {
          user,
          token
        },
        statusCode: res.statusCode
      })
    }
    user = await database.prisma.user.create({
      data: {
        username: req.body.displayName,
        email: req.body.email,
        googleId: req.body.id,
        password: await hash(req.body.id),
        isAdmin: false,
        mailVerification: true
      }
    })
    const token = utils.generateToken(user.id)
    return res.status(201).json({
      status: 'success',
      data: {
        user,
        token
      },
      statusCode: res.statusCode
    })
  } catch (err) {
    console.error(err.message)
    return res.status(401).send('Google auth failed.')
  }
})

/**
 * @swagger
 * /api/login/facebook:
 *   get:
 *     tags: [Authentification]
 *     summary: Authenticate with Facebook
 *     description: Endpoint to initiate authentification with Facebook.
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to Facebook login page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: <html><body><p>Found. Redirecting to https://www.facebook.com/v9.0/dialog/oauth?client_id=1234567890&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Ffacebook%2Fcallback&response_type=code&scope=email</p></body></html>
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get(
  '/api/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
)

/**
 * @swagger
 * /api/login/facebookCallBack:
 *   get:
 *     summary: Callback endpoint for Facebook authentification
 *     tags:
 *       - Authentification
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Returns a JSON object containing the user object and JWT token
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "success"
 *             data:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome back."
 *                 user:
 *                   type: object
 *                   $ref: '#/definitions/User'
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             statusCode:
 *               type: number
 *               example: 201
 *       401:
 *         description: Invalid Facebook authentification
 */
app.get(
  '/api/login/facebookCallBack',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    const user = req.user
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
  }
)

/**
 * @swagger
 * /api/token:
 *   post:
 *     tags: [Authentification]
 *     summary: Create/Update auth token.
 *     description: Create or update a user's auth tokens.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request body for creating/updating auth tokens.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               google:
 *                 type: string
 *               discord:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Returns the updated user with a new token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                 statusCode:
 *                   type: integer
 *       '400':
 *         description: Indicates that the token management system is temporarily deactivated.
 *       '401':
 *         description: Invalid JWT token.
 *       '500':
 *         description: Internal server error.
 */
app.post(
  '/api/token',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    if (!req.user) return res.status(401).send('Invalid token')
    try {
      const user = await database.prisma.User.update({
        where: { id: req.user.id },
        data: {
          googleToken: req.body.google != '' ? req.body.google : null,
          discordToken: req.body.discord != '' ? req.body.discord : null,
          deezerToken: req.body.deezer != '' ? req.body.deezer : null
        }
      })
      const token = utils.generateToken(user.id)
      return res.status(200).json({
        status: 'success',
        data: { message: 'Token updated.', user, token },
        statusCode: res.statusCode
      })
    } catch (err) {
      console.log(err)
      return res.status(400).send('Token manager temporarily desactivated.')
    }
  }
)

/**
 * @swagger
 * /api/code/deezer:
 *   post:
 *     tags: [Authentification]
 *     summary: Create or update auth token for Deezer service
 *     description: Create or update an authentication token for the Deezer service by providing an app ID, secret, and authorization code.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: JSON object containing the app ID, secret, and authorization code.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               app_id:
 *                 type: string
 *               secret:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auth token created/updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   description: Contains the access token for Deezer.
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       description: Access token for Deezer.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *                 statusCode:
 *                   type: integer
 *                   description: HTTP status code of the response.
 *                   example: 200
 *       400:
 *         description: Code generation has failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Code generation has failed."
 */
app.post(
  '/api/code/deezer',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    if (!req.user) return res.status(401).send('Invalid code')
    try {
      const ret = await axios.post(
        'https://connect.deezer.com/oauth/access_token.php?app_id=' +
          req.body.app_id +
          '&secret=' +
          req.body.secret +
          '&code=' +
          req.body.code +
          '&output=json'
      )
      return res.status(200).json({
        status: 'success',
        data: { access_token: ret.data.access_token },
        statusCode: res.statusCode
      })
    } catch (err) {
      console.log(err)
      return res.status(400).send('Code generation has failed.')
    }
  }
)

/**
 * @swagger
 * /api/get/Service:
 *   get:
 *     tags: [Services]
 *     summary: Get all enabled services sorted by creation date
 *     description: Returns a list of all enabled services sorted by creation date. Requires a valid JSON web token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with list of services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     services:
 *                       type: array
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       '401':
 *         description: Invalid token provided
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Invalid token
 *       '400':
 *         description: Service getter temporarily deactivated
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Service getter temporarily deactivated.
 */
app.get(
  '/api/get/Service',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (!req.user) return res.status(401).send('Invalid token')
    try {
      const services = await database.prisma.Service.findMany({
        where: {
          isEnable: true
        },
        include: {
          Actions: { include: { Parameters: true, DynamicParameters: true } },
          Reactions: { include: { Parameters: true } }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return res.status(200).json({
        status: 'success',
        data: {
          services
        },
        statusCode: res.statusCode
      })
    } catch (err) {
      return res.status(400).send('Service getter temporarily desactivated.')
    }
  }
  )

/**
 * @swagger
 *
 * /api/services/discord/getAvailablePerformers:
 *   get:
 *     tags: [Services/Discord]
 *     summary: List available performers such as bot/user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the list of available performers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1234567890"
 *                       name:
 *                         type: string
 *                         example: "Bot Name"
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: No Discord account linked or an error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Discord account linked."
 *                 statusCode:
 *                   type: number
 *                   example: 400
 */
app.get(
  '/api/services/discord/getAvailablePerformers',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const performers = []
    if (discordClient.presence.status == 'online')
      performers.push({
        id: discordClient.client.user.id,
        name: discordClient.client.user.username
      })
    if (req.user.discordToken != null)
      performers.push({
        id: req.user.discordToken,
        name: req.user.username
      })
    return res.status(200).json({
      status: 'success',
      data: performers,
      statusCode: res.statusCode
    })
  }
)

/**
 * @swagger
 *
 * /api/services/gmail/getAvailablePerformers:
 *   get:
 *     tags: [Services/Gmail]
 *     summary: List available performers such as bot/user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the list of available performers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1234567890"
 *                       name:
 *                         type: string
 *                         example: "User Name"
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: No Google account linked or an error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Google account linked."
 *                 statusCode:
 *                   type: number
 *                   example: 400
 */
app.get(
  '/api/services/gmail/getAvailablePerformers',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const performers = []
    if (req != null && req.user != null && req.user.googleToken != null)
      performers.push({
        id: req.user.googleToken,
        name: req.user.username
      })
    performers.push({
      id: 'aequallsquared@gmail.com',
      name: 'Default Bot Gmail'
    })
    return res.status(200).json({
      status: 'success',
      data: performers,
      statusCode: res.statusCode
    })
  }
)

/**
 * @swagger
 *
 * /api/services/discord/getVoiceChannels:
 *   get:
 *     tags: [Services/Discord]
 *     summary: List all available Voice Channels on a given Guild ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Discord guild.
 *     responses:
 *       '200':
 *         description: Successful response with the list of voice channels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                   example: success
 *                 data:
 *                   type: array
 *                   description: An array of voice channel objects.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the voice channel.
 *                       name:
 *                         type: string
 *                         description: The name of the voice channel.
 *                       type:
 *                         type: string
 *                         description: The type of the voice channel.
 *                         enum: [voice]
 *                       createdAt:
 *                         type: string
 *                         description: The date and time when the voice channel was created.
 *                 statusCode:
 *                   type: number
 *                   description: The status code of the response.
 *                   example: 200
 */
app.get(
  '/api/services/discord/getVoiceChannels',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const channels = getVoiceChannels(req.query.id)
    return res.status(200).json({
      status: 'success',
      data: channels,
      statusCode: res.statusCode
    })
  }
)

/**
 * @swagger
 * /api/services/discord/getTextChannels:
 *   get:
 *     tags: [Services/Discord]
 *     summary: List all available Text Channels on a given GuildID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the guild to retrieve channels from.
 *     responses:
 *       200:
 *         description: A list of available text channels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique ID of the text channel.
 *                       name:
 *                         type: string
 *                         description: The name of the text channel.
 *                       position:
 *                         type: integer
 *                         description: The position of the text channel in the guild's channel list.
 *                       parentId:
 *                         type: string
 *                         description: The ID of the parent category for the text channel, if applicable.
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Service getter temporarily disabled.
 *       401:
 *         description: Invalid token.
 *       404:
 *         description: Guild not found.
 */
app.get(
  '/api/services/discord/getTextChannels',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const channels = getTextChannels(req.query.id)
    return res.status(200).json({
      status: 'success',
      data: channels,
      statusCode: res.statusCode
    })
  }
)

/**
 * @swagger
 * /api/services/discord/getAvailableGuilds:
 *   get:
 *     tags: [Services/Discord]
 *     summary: List all available Guilds where the bot is.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of available guilds.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                   example: success
 *                 data:
 *                   type: array
 *                   description: An array of guilds.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier for the guild.
 *                         example: '1234567890'
 *                       name:
 *                         type: string
 *                         description: The name of the guild.
 *                         example: 'My Discord Server'
 *                 statusCode:
 *                   type: number
 *                   description: The status code of the response.
 *                   example: 200
 *       400:
 *         description: An error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: No Discord account linked.
 *                 statusCode:
 *                   type: number
 *                   description: The status code of the response.
 *                   example: 400
 */
app.get(
  '/api/services/discord/getAvailableGuilds',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.discordToken == null)
      return res.status(400).send('No Discord account linked.')
    try {
      const guilds = await getAvailableGuilds(req.user.discordToken)
      if (guilds == null) return res.status(400).send('An error occured.')
      return res.status(200).json({
        status: 'success',
        data: guilds,
        statusCode: res.statusCode
      })
    } catch (err) {
      console.log(err)
      return res.status(400).send('An error occured.')
    }
  }
)

/**
 * @swagger
 * /api/services/calendar/getAvailableCalendars:
 *   get:
 *     tags: [Services/Calendar]
 *     summary: List all available Google calendars
 *     description: Returns a list of all available Google calendars linked to the user's account.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Calendars listed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       summary:
 *                         type: string
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: Invalid or missing Google auth token.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "No Google account linked."
 *       500:
 *         description: An error occurred while processing the request.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "An error occurred."
 */
app.get('/api/services/calendar/getAvailableCalendars', (req, res) => {
  if (req.user.googleToken == null)
    return res.status(400).send('No Google account linked.')
  try {
    const calendars = getAvailableCalendars()
    res.status(200).json({
      status: 'success',
      data: calendars,
      statusCode: res.statusCode
    })
  } catch (error) {
    res.status(400).send('An error occured.')
  }
})

/**
 * @swagger
 * /api/services/deezer/getUserPlaylists:
 *   get:
 *     tags: [Services/Deezer]
 *     summary: List all user's playlist on Deezer
 *     description: List all user's playlist on Deezer, requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's playlists listed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       title:
 *                         type: string
 *                       picture:
 *                         type: string
 *                       description:
 *                         type: string
 *                       nb_tracks:
 *                         type: number
 *                       is_public:
 *                         type: boolean
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: Deezer account not linked or error occurred.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get(
  '/api/services/deezer/getUserPlaylists',
  passport.authenticate('jwt', { sessions: false }),
  async (req, res) => {
    if (req.user.deezerToken == null)
      return res.status(400).send('No Deezer account linked.')
    try {
      const playlists = await getUserPlaylists(
        req.user.deezerId,
        req.user.deezerToken
      )
      if (playlists == null) return res.status(400).send('No playlist found.')
      return res.status(200).json({
        status: 'success',
        data: playlists,
        statusCode: res.statusCode
      })
    } catch (err) {
      console.log(err)
      return res.status(400).send('An error occured.')
    }
  }
)

/**
 * @swagger
 *
 * /api/services/rea/getAvailableArea:
 *   get:
 *     tags: [Services/Rea]
 *     summary: List available area for rea service
 *     description: Retrieves the list of available areas for the rea service.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of available areas for the rea service
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   example: success
 *                 data:
 *                   type: array
 *                   description: The list of available areas
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the area
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The name of the area
 *                         example: Living Room
 *                 statusCode:
 *                   type: integer
 *                   description: The status code of the response
 *                   example: 200
 */
app.get(
  '/api/services/rea/getAvailableArea',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const area = []
    const areas = await database.prisma.AREA.findMany({
      where: { userId: req.user.id }
    })
    areas.forEach(areaContent => {
      area.push({
        id: areaContent.id,
        name: areaContent.name
      })
    })
    return res.status(200).json({
      status: 'success',
      data: area,
      statusCode: res.statusCode
    })
  }
)

/**
 * @swagger
 * /api/services/rea/getAvailableStatus:
 *   get:
 *     tags: [Services/Rea]
 *     summary: List available status for rea service
 *     description: Retrieves the list of available status for the rea service.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of available status for the rea service
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   example: success
 *                 data:
 *                   type: array
 *                   description: The list of available status
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the status
 *                         example: True
 *                       name:
 *                         type: string
 *                         description: The name of the status
 *                         example: On
 *                 statusCode:
 *                   type: integer
 *                   description: The status code of the response
 *                   example: 200
 */
app.get(
  '/api/services/rea/getAvailableStatus',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const status = []
    status.push({
      id: 'True',
      name: 'On'
    })
    status.push({
      id: 'False',
      name: 'Off'
    })
    return res.status(200).json({
      status: 'success',
      data: status,
      statusCode: res.statusCode
    })
  }
)

/**
 * Creating a new user in the database.
 * body.username -> User name
 * body.email -> User mail
 * body.password -> User password
 */
app.post('/api/dev/user/create', async (req, res) => {
  try {
    const user = await database.prisma.User.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: await hash(req.body.password),
        mailVerification: true
      }
    })
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(400).json('Please pass a complete body.')
  }
})

/**
 * Add the Deezer ID to the user in the database.
 * Route protected by a JWT token
 */
app.post(
  '/api/services/deezer/fillUserId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.deezerToken == null)
      return res.status(400).send('No Deezer account linked.')
    try {
      const response = await axios.get(
        'https://api.deezer.com/user/me?access_token=' + req.user.deezerToken,
        {
          headers: {
            Authorization: `Bearer ${req.user.deezerToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      const user = await database.prisma.User.update({
        where: { id: req.user.id },
        data: {
          deezerId: response.data.id.toString()
        }
      })
      return res.status(200).send('Deezer ID successfully updated.')
    } catch (err) {
      console.log(err)
      return res.status(400).send('An error occured.')
    }
  }
)

/**
 * @swagger
 *
 * /api/dev/user/create:
 *   post:
 *     summary: Create a new user in the database
 *     tags: [Dev]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User name
 *               email:
 *                 type: string
 *                 description: User mail
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: The newly created user
 *       400:
 *         description: Please pass a complete body.
 */
app.get('/api/dev/user/listall', async (req, res) => {
  try {
    const users = await database.prisma.User.findMany()
    return res.json(users)
  } catch (err) {
    console.log(err)
    return res.status(400).json('An error occured.')
  }
})


/**
 * @swagger
 *
 * /api/dev/user/listall:
 *   get:
 *     summary: List all users in the database
 *     tags: [Dev]
 *     responses:
 *       200:
 *         description: The list of all users
 *       400:
 *         description: An error occured.
 */
app.post('/api/dev/service/create', async (req, res) => {
  try {
    const service = await database.prisma.Service.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        primaryColor: req.body.primaryColor,
        secondaryColor: req.body.secondaryColor,
        icon: req.body.icon
      }
    })
    return res.json(service)
  } catch (err) {
    console.log(err)
    return res.status(400).json('Please pass a complete body.')
  }
})

/**
 * @swagger
 * /api/dev/service/listall:
 *   get:
 *     tags: [Dev]
 *     summary: List all services in the database.
 *     responses:
 *       200:
 *         description: Returns the list of all services in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       400:
 *         description: An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
app.get('/api/dev/service/listall', async (req, res) => {
  try {
    const services = await database.prisma.Service.findMany()
    return res.json(services)
  } catch (err) {
    console.log(err)
    return res.status(400).json('An error occured.')
  }
})


/**
 * @swagger
 * /api/dev/action/create:
 *   post:
 *     tags: [Dev]
 *     summary: Creating a new action.
 *     requestBody:
 *       description: The action details to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Action name
 *                 example: "Turn on the light"
 *               description:
 *                 type: string
 *                 description: Action description (optional)
 *                 example: "This action turns on the light in the living room"
 *               serviceId:
 *                 type: integer
 *                 description: Service ID
 *                 example: 1
 *     responses:
 *       200:
 *         description: Returns the newly created action.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 *       400:
 *         description: Please pass a complete body.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
app.post('/api/dev/action/create', async (req, res) => {
  try {
    const action = await database.prisma.Action.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        Service: { connect: { id: req.body.serviceId } }
      }
    })
    return res.json(action)
  } catch (err) {
    console.log(err)
    return res.status(400).json('Please pass a complete body.')
  }
})

/**
 * @swagger
 * /api/dev/action/listall:
 *   get:
 *     tags: [Dev]
 *     summary: List all actions in the database.
 *     responses:
 *       200:
 *         description: A list of all actions in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       400:
 *         description: An error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: An error occurred.
 */
app.get('/api/dev/action/listall', async (req, res) => {
  try {
    const actions = await database.prisma.Action.findMany({
      include: {
        Parameters: true,
        DynamicParameters: true
      }
    })
    return res.json(actions)
  } catch (err) {
    console.log(err)
    return res.status(400).json('An error occured.')
  }
})

/**
 * @swagger
 * /api/dev/reaction/create:
 *   post:
 *     tags: [Dev]
 *     summary: Creating a new reaction.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               serviceId:
 *                 type: integer
 *             required:
 *               - name
 *               - serviceId
 *     responses:
 *       200:
 *         description: The newly created reaction.
 *         content:
 *           application/json:
 *       400:
 *         description: Please pass a complete body.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Please pass a complete body.
 */
app.post('/api/dev/reaction/create', async (req, res) => {
  try {
    const reaction = await database.prisma.Reaction.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        Service: { connect: { id: req.body.serviceId } }
      }
    })
    return res.json(reaction)
  } catch (err) {
    console.log(err)
    return res.status(400).json('Please pass a complete body.')
  }
})

/**
 * @swagger
 * /api/dev/reaction/listall:
 *   get:
 *     tags: [Dev]
 *     summary: Get a list of all reactions in the database.
 *     responses:
 *       '200':
 *         description: A list of all reactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reaction'
 *       '400':
 *         description: An error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
app.get('/api/dev/reaction/listall', async (req, res) => {
  try {
    const reactions = await database.prisma.Reaction.findMany({
      include: {
        Parameters: true
      }
    })
    return res.json(reactions)
  } catch (err) {
    console.log(err)
    return res.status(400).json('An error occured.')
  }
})

/**
 * @swagger
 * /api/dev/parameter/create:
 *   post:
 *     tags: [Dev]
 *     summary: Create a new parameter.
 *     requestBody:
 *       description: Parameter information to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               isRequired:
 *                 type: boolean
 *               description:
 *                 type: string
 *               actionId:
 *                 type: integer
 *               reactionId:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: The newly created parameter.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parameter'
 *       '400':
 *         description: Please pass a complete body.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
app.post('/api/dev/parameter/create', async (req, res) => {
  try {
    if (req.body.actionId) {
      const parameter = await database.prisma.Parameter.create({
        data: {
          name: req.body.name,
          isRequired: req.body.isRequired,
          description: req.body.description,
          Action: { connect: { id: req.body.actionId } }
        }
      })
    } else if (req.body.reactionId) {
      const parameter = await database.prisma.Parameter.create({
        data: {
          name: req.body.name,
          isRequired: req.body.isRequired,
          description: req.body.description,
          Reaction: { connect: { id: req.body.reactionId } }
        }
      })
    } else {
      return res.status(400).json('Please pass a complete body.')
    }
    return res.json(parameter)
  } catch (err) {
    console.log(err)
    return res.status(400).json('Please pass a complete body.')
  }
})

/**
 * @swagger
 * /api/dev/parameter/listall:
 *   get:
 *     tags: [Dev]
 *     summary: Get a list of all parameters in the database.
 *     responses:
 *       '200':
 *         description: A list of all parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Parameter'
 *       '400':
 *         description: An error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *
 * components:
 *   schemas:
 *     Reaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *     Parameter:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         isRequired:
 *           type: boolean
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         Action:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         Reaction:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 */
app.get('/api/dev/parameter/listall', async (req, res) => {
  try {
    const parameters = await database.prisma.Parameter.findMany()
    return res.json(parameters)
  } catch (err) {
    console.log(err)
    return res.status(400).json('An error occured.')
  }
})

/**
 * @swagger
 * /api/dev/area/create:
 *   post:
 *     tags: [Dev]
 *     summary: Create a new area
 *     description: Create a new area with specified parameters.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               actionId:
 *                 type: string
 *               actionParameters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     paramId:
 *                       type: string
 *                     value:
 *                       type: string
 *               reactionId:
 *                 type: string
 *               reactionParameters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     paramId:
 *                       type: string
 *                     value:
 *                       type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Area created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 isEnable:
 *                   type: boolean
 *                 User:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                 Action:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *                 ActionParameters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       Parameter:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           isRequired:
 *                             type: boolean
 *                           description:
 *                             type: string
 *                       value:
 *                         type: string
 *                 Reactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       Reaction:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           code:
 *                             type: string
 *                       ReactionParameters:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             Parameter:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 isRequired:
 *                                   type: boolean
 *                                 description:
 *                                   type: string
 *                             value:
 *                               type: string
 *       400:
 *         description: Bad request. Please pass a complete body.
 */
app.post('/api/dev/area/create', async (req, res) => {
  try {
    if (!checkAreaNameAlreadyExistForGivenUser(req.user.id, req.body.name))
      return res.status(400).send('Please give a non existent area name.')

    //Create each action parameter
    const ActionParameters = []
    req.body.actionParameters.forEach(param => {
      ActionParameters.push({
        Parameter: { connect: { id: param.paramId } },
        value: param.value
      })
    })

    //Create each reaction with its parameters
    const Reactions = []
    req.body.reactions.forEach(reaction => {
      //Create each reaction parameter
      const ReactionParameters = []
      reaction.reactionParameters.forEach(param => {
        ReactionParameters.push({
          Parameter: { connect: { id: param.paramId } },
          value: param.value
        })
      })
      Reactions.push({
        Reaction: { connect: { id: reaction.id } },
        ReactionParameters: { create: ReactionParameters }
      })
    })

    //Create the area
    const areaCreation = await database.prisma.AREA.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        User: { connect: { id: req.user.id } },
        Action: { connect: { id: req.body.actionId } },
        ActionParameters: { create: ActionParameters },
        Reactions: { create: Reactions }
      },
      select: {
        id: true,
        isEnable: true,
        User: true,
        ActionParameters: {
          include: {
            Parameter: true
          }
        },
        Action: true
      }
    })
    if (areaCreation.isEnable && TriggerInitMap[areaCreation.Action.code])
      if (!TriggerInitMap[areaCreation.Action.code](areaCreation)) {
        await database.prisma.AREA.delete({
          where: { id: areaCreation.id }
        })
        return res.status(400).send('Please pass a valid parameter list !')
      }
    return res.json(areaCreation)
  } catch (err) {
    console.log(err)
    return res.status(400).json('Please pass a complete body.')
  }
})

/**
 * @swagger
 * /api/dev/area/listall:
 *   get:
 *     tags: [Dev]
 *     summary: List all areas
 *     description: List all areas in the database.
 *     responses:
 *       200:
 *         description: Areas listed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   isEnable:
 *                     type: boolean
 *                   User:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                   Action:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       code:
 *                         type: string
 *                       description:
 *                         type: string
 *                   ActionParameters:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         value:
 *                           type: string
 *                         Parameter:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             description:
 *                               type: string
 *                   Reactions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         Reaction:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             code:
 *                               type: string
 *                             description:
 *                               type: string
 *                         ReactionParameters:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               value:
 *                                 type: string
 *                               Parameter:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                                   description:
 *                                     type: string
 */

app.get('/api/dev/area/listall', async (req, res) => {
  try {
    const areas = await database.prisma.AREA.findMany()
    return res.json(areas)
  } catch (err) {
    console.log(err)
    return res.status(400).json('An error occured.')
  }
})

/**
 * /api/dev/service/createAll:
 *   get:
 *     tags: [Dev]
 *     summary: Initialize the database with all services, actions, reactions and parameters.
 *     description: Initializes the database with all supported services, actions, reactions and parameters.
 *     responses:
 *       200:
 *         description: Services, actions, reactions and parameters initialized successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   Actions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *                         code:
 *                           type: string
 *                         Parameters:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                   Reactions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *                         code:
 *                           type: string
 *                         Parameters:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               description:
 *                                 type: string
 */
app.get('/api/dev/service/createAll', async (req, res) => {
  const response = []
  response.push(await createDiscordService())
  response.push(await createGmailService())
  response.push(await createCalendarService())
  response.push(await createTimeTimeService())
  response.push(await createReaaaaaaaService())
  response.push(await createDeezerService())
  return res.json(response)
})

require('./api/area/area.js')(app, passport, database)
require('./api/area/reaction/reaction.js')(app, passport, database)
require('./api/area/action/action.js')(app, passport, database)

/**
 * Start the node.js server at PORT and HOST variable
 */
app.listen(PORT, HOST, () => {
  console.log(`Server running...`)
})

module.exports = { test_example, app }
