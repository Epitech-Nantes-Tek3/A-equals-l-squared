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
require('dotenv').config({ path: '../database.env' })

const onMessage = require('./services/discord/actions/on_message')
const onVoiceChannel = require('./services/discord/actions/on_join_voice_channel')
const onReactionAdd = require('./services/discord/actions/on_reaction_add')
const onMemberJoining = require('./services/discord/actions/on_member_joining')
const discordClient = require('./services/discord/init')
const { createGmailService } = require('./services/gmail/gmail_init')
const { createDiscordService } = require('./services/discord/init')
const getVoiceChannels = require('./services/discord/getters/voice_channels')
const getTextChannels = require('./services/discord/getters/text_channels')
const getAvailableGuilds = require('./services/discord/getters/available_guilds')
const { createTimeTimeService } = require('./services/timetime/init')

const app = express()

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

const PORT = 8080
const HOST = '0.0.0.0'

/**
 * Add here the database operation needed for development testing
 */
const createDevelopmentData = async () => {
  createGmailService()
  createDiscordService()
}

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
 * Required subject path, send some usefully data about service
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
      data: { message: 'Welcome back.', user, token },
      statusCode: res.statusCode
    })
  })(req, res, next)
})

/**
 * Get request use to verify e-mail address with a token
 * Link sent by e-mail
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
 * Get request to confirm a custom action.
 * Link sent by e-mail
 * Delete -> Remove the user credentials from the database
 * ResetPassword -> Reset the current user password and set it to 'password'
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
 * Get request to delete an account
 * Send a confirmation e-mail before deleting.
 * Need to be authenticated with a token.
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
 * Send a confirmation e-mail before reseting.
 * body.email -> User mail
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
      user.email,
      'Confirm operation',
      'You asked to regenerate your password. It will be set to : password\nPlease confirm this operation by visiting this link : http://localhost:8080/api/mail/customVerification?token=' +
        token
    )
    .catch(_error => {
      return res.status(401).send('Invalid e-mail address.')
    })
  return res.json('Verification e-mail sent.')
})

/**
 * Post request to update user personal data.
 * body.username -> User name
 * body.email -> User mail
 * body.password -> User password
 * Road protected by token authentication
 * An new e-mail verification is sent when e-mail is updated.
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
            req.body.email,
            'Email Verification',
            'You have updated your e-mail, please go to the following link to confirm your new mail address : http://localhost:8080/api/mail/verification?token=' +
              token
          )
          .catch(_error => {
            return res.status(401).send('Invalid new e-mail address.')
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
 * Post request to login with google methods
 * body.id -> Google Id
 * body.email -> User Email
 * body.displayName -> User name
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
 * Get request to login with facebook methods
 */
app.get(
  '/api/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
)

/**
 * Private request used by facebook after login operation
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
 * Route used for Create/Update auth token
 * If no token storage is already linked with the user, a new one is created
 * body.google The Google auth token (Set to '' to remove it)
 * body.discord The Discord auth token (Set to '' to remove it)
 * Route protected by a JWT token
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
          discordToken: req.body.discord != '' ? req.body.discord : null
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
      return res.status(400).send('Token gestionner temporaly desactivated.')
    }
  }
)

/**
 * Get request returning all enabled service sorted by creation date.
 * Need to be authenticated with a token.
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
          Actions: { include: { Parameters: true } },
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
 * Get request returning all user AREA sorted by creation date.
 * Need to be authenticated with a token.
 */
app.get(
  '/api/get/area',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (!req.user) return res.status(401).send('Invalid token')
    try {
      const areas = await database.prisma.UsersHasActionsReactions.findMany({
        where: {
          userId: req.user.id
        },
        include: {
          ActionParameters: true,
          ReactionParameters: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return res.status(200).json({
        status: 'success',
        data: {
          areas
        },
        statusCode: res.statusCode
      })
    } catch (err) {
      console.log(err)
      return res.status(400).send('AREA getter temporarily desactivated.')
    }
  }
)

/**
 * Post function used for deleting an area
 * body.id -> id of the AREA to delete
 * Route protected by a JWT token
 */
app.post(
  '/api/delete/area',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    if (!req.user) return res.status(401).send('Invalid token')
    try {
      await database.prisma.UsersHasActionsReactions.delete({
        where: { id: req.body.id }
      })
      return res.status(200).send('AREA successfully deleted.')
    } catch (err) {
      console.log(err)
      return res.status(400).send('You cannot delete this area.')
    }
  }
)

/**
 * Post function used for updating an area
 * body.id -> id of the AREA to update
 * body.name -> Name of the area
 * body.isEnable -> Status of the area
 * body.description -> Description of the area (optionnal)
 * body.actionId -> Action id (optionnal if reactionId is set)
 * body.actionParameters -> Action parameters (optional)
 * body.reactionId -> Reaction id (optionnal if actionId is set)
 * body.reactionParameters -> Reaction parameters (optionnal)
 * Route protected by a JWT token
 */
app.post(
  '/api/update/area',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    if (!req.user) return res.status(401).send('Invalid token')
    try {
      const oldArea = await database.prisma.UsersHasActionsReactions.findUnique(
        {
          where: {
            id: req.body.id
          },
          include: {
            ActionParameters: true,
            ReactionParameters: true
          }
        }
      )
      req.body.actionParameters.forEach(async param => {
        oldArea.ActionParameters.forEach(async actionParam => {
          if (actionParam.parameterId == param.paramId)
            await database.prisma.ActionParameter.update({
              where: {
                id: actionParam.id
              },
              data: {
                value: param.value
              }
            })
        })
      })
      req.body.reactionParameters.forEach(async param => {
        oldArea.ReactionParameters.forEach(async reactionParam => {
          if (reactionParam.parameterId == param.paramId)
            await database.prisma.ReactionParameter.update({
              where: {
                id: reactionParam.id
              },
              data: {
                value: param.value
              }
            })
        })
      })
      await database.prisma.UsersHasActionsReactions.update({
        where: { id: req.body.id },
        data: {
          name: req.body.name,
          isEnable: req.body.isEnable,
          description: req.body.description,
          Action: { connect: { id: req.body.actionId } },
          Reaction: { connect: { id: req.body.reactionId } }
        }
      })
      return res.status(200).send('AREA successfully updated.')
    } catch (err) {
      console.log(err)
      return res.status(400).send('You cannot update this area.')
    }
  }
)

/*
 * @brief List all available Voice Channels on a given Guild ID.
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
 * @brief List all available Text Channels on a given GuildID.
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
 * @brief List all available Guilds where the bot is.
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
 * @brief List available performers, such as bot/user.
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
 * @brief List available performers, such as bot/user.
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
 * Creating a new user in the database.
 * bodi.username -> User name
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
 * List all users in the database.
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
 * Creating a new service in the database.
 * body.name -> Service name
 * body.description -> Service description (optionnal)
 * body.primaryColor -> Description of the area (optionnal, set by default #000000)
 * body.secondaryColor -> Description of the area (optionnal, set by default #000000)
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
 * List all services in the database.
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
 * Creating a new action.
 * body.name -> Action name
 * body.description -> Action description (optionnal)
 * body.serviceId -> Service id
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
 * List all actions in the database.
 */
app.get('/api/dev/action/listall', async (req, res) => {
  try {
    const actions = await database.prisma.Action.findMany()
    return res.json(actions)
  } catch (err) {
    console.log(err)
    return res.status(400).json('An error occured.')
  }
})

/**
 * Creating a new reaction.
 * body.name -> Reaction name
 * body.description -> Reaction description (optionnal)
 * body.serviceId -> Service id
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
 * List all reactions in the database.
 */
app.get('/api/dev/reaction/listall', async (req, res) => {
  try {
    const reactions = await database.prisma.Reaction.findMany()
    return res.json(reactions)
  } catch (err) {
    console.log(err)
    return res.status(400).json('An error occured.')
  }
})

/**
 * Creating a new parameter.
 * body.name -> Parameter name
 * body.isRequired -> Parameter is required or not
 * body.description -> Parameter description (optionnal)
 * body.actionId -> Action id (optionnal)
 * body.reactionId -> Reaction id (optionnal)
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
 * List all parameters in the database.
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
 * Creating a new area.
 * body.name -> Name of the area. (need to be set)
 * body.description -> Description of the area (optionnal)
 * body.actionId -> Action id (optionnal if reactionId is set)
 * body.actionParameters -> Action parameters (optionnal)
 * body.reactionId -> Reaction id (optionnal if actionId is set)
 * body.reactionParameters -> Reaction parameters (optionnal)
 * Protected by a JWT token
 */
app.post(
  '/api/area/create',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (!req.user) return res.status(401).send('Invalid token')
    try {
      const ActionParameters = []

      req.body.actionParameters.forEach(param => {
        ActionParameters.push({
          Parameter: { connect: { id: param.paramId } },
          value: param.value
        })
      })

      const ReactionParameters = []

      req.body.reactionParameters.forEach(param => {
        ReactionParameters.push({
          Parameter: { connect: { id: param.paramId } },
          value: param.value
        })
      })

      const areaCreation =
        await database.prisma.UsersHasActionsReactions.create({
          data: {
            name: req.body.name,
            description: req.body.description,
            User: { connect: { id: req.user.id } },
            Action: { connect: { id: req.body.actionId } },
            ActionParameters: { create: ActionParameters },
            Reaction: { connect: { id: req.body.reactionId } },
            ReactionParameters: { create: ReactionParameters }
          }
        })
      return res.json(areaCreation)
    } catch (err) {
      console.log(err)
      return res.status(400).json('Please pass a complete body.')
    }
  }
)

/**
 * Creating a new area without protection.
 * body.name -> Name of the area. (need to be set)
 * body.description -> Description of the area (optionnal)
 * body.actionId -> Action id (optionnal if reactionId is set)
 * body.actionParameters -> Action parameters (optionnal)
 * body.reactionId -> Reaction id (optionnal if actionId is set)
 * body.reactionParameters -> Reaction parameters (optionnal)
 */
app.post('/api/dev/area/create', async (req, res) => {
  try {
    const ActionParameters = []

    req.body.actionParameters.forEach(param => {
      ActionParameters.push({
        Parameter: { connect: { id: param.paramId } },
        value: param.value
      })
    })

    const ReactionParameters = []

    req.body.reactionParameters.forEach(param => {
      ReactionParameters.push({
        Parameter: { connect: { id: param.paramId } },
        value: param.value
      })
    })

    const areaCreation = await database.prisma.UsersHasActionsReactions.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        User: { connect: { id: req.body.userId } },
        Action: { connect: { id: req.body.actionId } },
        ActionParameters: { create: ActionParameters },
        Reaction: { connect: { id: req.body.reactionId } },
        ReactionParameters: { create: ReactionParameters }
      }
    })
    return res.json(areaCreation)
  } catch (err) {
    console.log(err)
    return res.status(400).json('Please pass a complete body.')
  }
})

/**
 * List all areas in the database.
 */
app.get('/api/dev/area/listall', async (req, res) => {
  try {
    const areas = await database.prisma.UsersHasActionsReactions.findMany()
    return res.json(areas)
  } catch (err) {
    console.log(err)
    return res.status(400).json('An error occured.')
  }
})

/**
 * Initialize the database with all services, actions, reactions and parameters.
 */
app.get('/api/dev/service/createAll', async (req, res) => {
  const response = []
  response.push(await createDiscordService())
  response.push(await createGmailService())
  response.push(await createTimeTimeService())
  return res.json(response)
})

/**
 * Start the node.js server at PORT and HOST variable
 */
app.listen(PORT, HOST, () => {
  console.log(`Server running...`)
})

module.exports = { test_example }
