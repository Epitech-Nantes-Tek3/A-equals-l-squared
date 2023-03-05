'use strict'

/** @module route */

const express = require('express')
const passport = require('passport')
const database = require('./database_init')
const bodyParser = require('body-parser')
const session = require('express-session')
require('dotenv').config({ path: '../database.env' })
const app = express()

const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const onMessage = require('./services/discord/actions/on_message')
const onVoiceChannel = require('./services/discord/actions/on_join_voice_channel')
const onReactionAdd = require('./services/discord/actions/on_reaction_add')
const onMemberJoining = require('./services/discord/actions/on_member_joining')

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'A=L² API',
      version: '1.0.0',
      description: 'API for A=L² Area Epitech project'
    },
    servers: [
      {
        url: 'http://localhost:8080'
      }
    ],
    tags: [
      {
        name: 'About',
        description: 'About the A=L² project'
      },
      {
        name: 'User',
        description: 'User management'
      },
      {
        name: 'Authentication',
        description: 'Authentication management'
      },
      {
        name: 'Services',
        description: 'Service management',
        children: [
          {
            name: 'Gmail',
            description: 'Gmail management'
          },
          {
            name: 'Discord',
            description: 'Discord management'
          },
          {
            name: 'Calendar',
            description: 'Calendar management'
          },
          {
            name: 'Deezer',
            description: 'Deezer management'
          }
        ]
      },
      {
        name: 'Area',
        description: 'Area management',
        children: [
          {
            name: 'Action',
            description: 'Action management'
          },
          {
            name: 'Reaction',
            description: 'Reaction management'
          }
        ]
      }
    ],
    host: 'localhost:8080',
    basePath: '/'
  },
  consumes: ['application/json'],
  produces: ['application/json'],
  apis: ['server_app.js', 'api/**/*.js', 'api/area/**/*.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

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
    res.type('json').send(JSON.stringify(about, null, 2) + '\n')
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

require('./api/area/area.js')(app, passport, database)
require('./api/area/reaction/reaction.js')(app, passport, database)
require('./api/area/action/action.js')(app, passport, database)
require('./api/user/user.js')(app, passport, database)
require('./api/auth/auth.js')(app, passport, database)
require('./api/services/services.js')(app, passport, database)
require('./api/services/discord.js')(app, passport, database)
require('./api/services/deezer.js')(app, passport, database)
require('./api/services/google.js')(app, passport)
require('./api/services/rea.js')(app, passport, database)
require('./api/services/reddit.js')(app, passport, database)
require('./api/dev/dev.js')(app, database)
require('./api/auth/auth.js')(app, passport, database)

/**
 * @swagger
 * components:
 *   schemas:
 *     Action:
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
 *     Service:
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
 *         Actions:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/Action'
 *         Reactions:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/Reaction'
 *         Parameters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Parameter'
 */

/**
 * Start the node.js server at PORT and HOST variable
 */
app.listen(PORT, HOST, () => {
  console.log(`Server running http://${HOST}:${PORT}`)
  console.log(`Api documentation available on http://${HOST}:${PORT}/api-docs`)
})

module.exports = { test_example, app }
