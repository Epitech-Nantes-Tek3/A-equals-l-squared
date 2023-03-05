'use strict'

const { generateDeezerService } = require('../../services/deezer/init')
const { generateGmailService } = require('../../services/gmail/gmail_init')
const {
  generateCalendarService
} = require('../../services/calendar/calendar_init')
const { generateDiscordService } = require('../../services/discord/init')
const { generateTimeTimeService } = require('../../services/timetime/init')
const { generateReaaaaaaaService } = require('../../services/reaaaaaaa/init')
const { generateRedditService } = require('../../services/reddit/init')

module.exports = function (app, database) {
  /**
   * @swagger
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
   * @swagger
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
  app.get('/api/dev/user/listall', async (req, res) => {
    try {
      const users = await database.prisma.User.findMany()
      return res.json(users)
    } catch (err) {
      console.log(err)
      return res.status(400).json('An error occured.')
    }
  })

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
        include: { Parameters: true, DynamicParameters: true }
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
        include: { Parameters: true }
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
   *       - jwt: []
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

      // Create each action parameter
      const ActionParameters = []
      req.body.actionParameters.forEach(param => {
        ActionParameters.push({
          Parameter: { connect: { id: param.paramId } },
          value: param.value
        })
      })

      // Create each reaction with its parameters
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

      // Create the area
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
          ActionParameters: { include: { Parameter: true } },
          Action: true
        }
      })
      if (areaCreation.isEnable && TriggerInitMap[areaCreation.Action.code])
        if (!TriggerInitMap[areaCreation.Action.code](areaCreation)) {
          await database.prisma.AREA.delete({ where: { id: areaCreation.id } })
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
   * @swagger
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
    response.push(await generateDiscordService(database))
    response.push(await generateGmailService(database))
    response.push(await generateCalendarService(database))
    response.push(await generateTimeTimeService(database))
    response.push(await generateReaaaaaaaService(database))
    response.push(await generateDeezerService(database))
    response.push(await generateRedditService(database))
    return res.json(response)
  })
}
