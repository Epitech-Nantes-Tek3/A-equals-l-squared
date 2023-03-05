'use strict'

const { TriggerDestroyMap } = require('../../services/timetime/init')
const { updateTriggeredLink } = require('../../services/glue/glue')

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * components:
   *   securitySchemes:
   *     bearerAuth:
   *       type: http
   *       scheme: bearer
   *       bearerFormat: JWT
   *   schemas:
   *     Area:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           description: The ID of the area
   *         name:
   *           type: string
   *           description: The name of the area
   *         userId:
   *           type: integer
   *           description: The ID of the user who created the area
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The date and time when the area was created
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           description: The date and time when the area was last updated
   *   responses:
   *     BadRequest:
   *       description: The request was invalid or could not be served
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               error:
   *                 type: string
   *                 description: A message describing the error
   *     Unauthorized:
   *       description: Authentication failed or user does not have permissions for the requested operation
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               error:
   *                 type: string
   *                 description: A message describing the error
   *     NotFound:
   *       description: The requested resource was not found
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               error:
   *                 type: string
   *                 description: A message describing the error
   *     InternalServerError:
   *       description: An error occurred while processing the request
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               error:
   *                 type: string
   *                 description: A message describing the error
   */

  /**
   * @swagger
   * /api/area:
   *   get:
   *     tags: [Area]
   *     summary: Get all areas
   *     description: Retrieve a list of all areas for the authenticated user
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         description: A list of areas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     description: Area unique ID.
   *                   name:
   *                     type: string
   *                     description: Area name.
   *                   isEnable:
   *                     type: boolean
   *                     description: Area is enable.
   *                   description:
   *                     type: string
   *                     description: Area description.
   *                   logicalGate:
   *                     type: string
   *                     description: Logical gate used to combine all actions and reactions of the area.
   *                   Actions:
   *                     type: array
   *                     description: Action object.
   *                     items:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: integer
   *                           description: Action unique ID.
   *                         triggered:
   *                           type: boolean
   *                           description: Indicates whether the action has been triggered.
   *                         Action:
   *                           type: object
   *                           description: Action object.
   *                           properties:
   *                             id:
   *                               type: integer
   *                               description: Action unique ID.
   *                             name:
   *                               type: string
   *                               description: Action name.
   *                             isEnable:
   *                               type: boolean
   *                               description: Action is enable.
   *                         ActionParameters:
   *                           type: array
   *                           description: Action parameters.
   *                           items:
   *                             type: object
   *                             properties:
   *                               Parameter:
   *                                 type: object
   *                                 description: Action parameter.
   *                                 properties:
   *                                   id:
   *                                     type: integer
   *                                     description: Parameter unique ID.
   *                                   name:
   *                                     type: string
   *                                     description: Parameter name.
   *                               value:
   *                                 type: string
   *                                 description: Action parameter value.
   *                   Reactions:
   *                     type: array
   *                     description: Reactions object.
   *                     items:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: integer
   *                           description: Reaction unique ID.
   *                         Reaction:
   *                           type: object
   *                           description: Reaction object.
   *                           properties:
   *                             id:
   *                               type: integer
   *                               description: Reaction unique ID.
   *                             name:
   *                               type: string
   *                               description: Reaction name.
   *                             isEnable:
   *                               type: boolean
   *                               description: Reaction is enable.
   *                         ReactionParameters:
   *                           type: array
   *                           description: Reaction parameters.
   *                           items:
   *                             type: object
   *                             properties:
   *                               Parameter:
   *                                 type: object
   *                                 description: Reaction parameter.
   *                                 properties:
   *                                   id:
   *                                     type: integer
   *                                     description: Parameter unique ID.
   *                                   name:
   *                                     type: string
   *                                     description: Parameter name.
   *                               value:
   *                                 type: string
   *                                 description: Reaction parameter value.
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  app.get(
    '/api/area',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const areas = await database.prisma.AREA.findMany({
          where: {
            userId: req.user.id
          },
          select: {
            id: true,
            name: true,
            isEnable: true,
            description: true,
            logicalGate: true,
            primaryColor: true,
            secondaryColor: true,
            updatedAt: true,
            icon: true,
            Actions: {
              select: {
                id: true,
                triggered: true,
                Action: {
                  select: {
                    id: true,
                    name: true,
                    isEnable: true
                  }
                },
                ActionParameters: {
                  select: {
                    id: true,
                    Parameter: {
                      select: {
                        id: true,
                        name: true
                      }
                    },
                    value: true
                  }
                }
              }
            },
            Reactions: {
              select: {
                id: true,
                Reaction: {
                  select: {
                    id: true,
                    name: true,
                    isEnable: true
                  }
                },
                ReactionParameters: {
                  select: {
                    id: true,
                    Parameter: {
                      select: {
                        id: true,
                        name: true
                      }
                    },
                    value: true
                  }
                }
              }
            }
          }
        })
        res.status(200).json(areas)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @swagger
   * /api/area/{id}:
   *   get:
   *     summary: Get an area by ID
   *     tags: [Area]
   *     description: Returns an area object with the specified ID, including its associated actions and reactions.
   *     security:
   *       - jwt: []
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the area to retrieve
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful response with the area object
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Unique ID of the area
   *                 name:
   *                   type: string
   *                   description: Name of the area
   *                 isEnable:
   *                   type: boolean
   *                   description: Whether the area is enabled or not
   *                 description:
   *                   type: string
   *                   description: Description of the area
   *                 logicalGate:
   *                   type: string
   *                   description: Logical gate for the area
   *                 Actions:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: Unique ID of the action
   *                       triggered:
   *                         type: boolean
   *                         description: Whether the action is triggered or not
   *                       Action:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             description: Unique ID of the action type
   *                           name:
   *                             type: string
   *                             description: Name of the action type
   *                           isEnable:
   *                             type: boolean
   *                             description: Whether the action type is enabled or not
   *                       ActionParameters:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             id:
   *                               type: string
   *                               description: Unique ID of the action parameter
   *                             Parameter:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                   type: string
   *                                   description: Unique ID of the action parameter type
   *                                 name:
   *                                   type: string
   *                                   description: Name of the action parameter type
   *                             value:
   *                               type: string
   *                               description: Value of the action parameter
   *                 Reactions:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: Unique ID of the reaction
   *                       Reaction:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             description: Unique ID of the reaction type
   *                           name:
   *                             type: string
   *                             description: Name of the reaction type
   *                           isEnable:
   *                             type: boolean
   *                             description: Whether the reaction type is enabled or not
   *                       ReactionParameters:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             id:
   *                               type: string
   *                               description: Unique ID of the reaction parameter
   *                             Parameter:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                   type: string
   *                                   description: Unique ID of the reaction parameter type
   *                                 name:
   *                                   type:
   *                                   description: Name of the reaction parameter type
   *                                 value:
   *                                   type: string
   *                                   description: Value of the reaction parameter
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  app.get(
    '/api/area/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const area = await database.prisma.AREA.findUnique({
          where: {
            id: req.params.id
          },
          select: {
            id: true,
            name: true,
            isEnable: true,
            description: true,
            logicalGate: true,
            primaryColor: true,
            secondaryColor: true,
            updatedAt: true,
            icon: true,
            Actions: {
              select: {
                id: true,
                triggered: true,
                Action: {
                  select: {
                    id: true,
                    name: true,
                    isEnable: true
                  }
                },
                ActionParameters: {
                  select: {
                    id: true,
                    Parameter: {
                      select: {
                        id: true,
                        name: true
                      }
                    },
                    value: true
                  }
                }
              }
            },
            Reactions: {
              select: {
                id: true,
                Reaction: {
                  select: {
                    id: true,
                    name: true,
                    isEnable: true
                  }
                },
                ReactionParameters: {
                  select: {
                    id: true,
                    Parameter: {
                      select: {
                        id: true,
                        name: true
                      }
                    },
                    value: true
                  }
                }
              }
            }
          }
        })
        if (!area && area.userId !== req.user.id)
          return res.status(404).json({ error: 'Area not found' })
        res.status(200).json(area)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * Cross all the User area and check the Name validity
   * @param {*} userId the user Id
   * @param {*} newName the wanted name
   * @returns True if the new name is valid, false otherwise
   */
  async function checkAreaNameAlreadyExistForGivenUser (
    userId,
    newName,
    actualAreaId
  ) {
    let where

    if (actualAreaId) {
      where = {
        userId: userId,
        name: newName,
        NOT: { id: actualAreaId }
      }
    } else {
      where = {
        userId: userId,
        name: newName
      }
    }
    const areas = await database.prisma.AREA.findMany({ where: where })
    return areas.length > 0
  }

  /**
   * @swagger
   * /api/area:
   *   post:
   *     summary: Create a new area
   *     description: Endpoint to create a new area for the authenticated user
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Area
   *     requestBody:
   *       description: Object containing area details
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: Mail from Discord
   *               description:
   *                 type: string
   *                 example: This area includes an action receive discord message and a reaction send mail
   *               isEnable:
   *                 type: boolean
   *                 example: true
   *               logicalGate:
   *                 type: string
   *                 example: OR
   *               primaryColor:
   *                 type: string
   *                 example: #000000
   *               secondaryColor:
   *                 type: string
   *                 example: #0000f0
   *               iconPath:
   *                 type: string
   *                 example: assets/icons/.png
   *     responses:
   *       '200':
   *         description: Created area object
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Unique ID of the area
   *                 name:
   *                   type: string
   *                   description: Name of the area
   *                 isEnable:
   *                   type: boolean
   *                   description: Whether the area is enabled or not
   *                 description:
   *                   type: string
   *                   description: Description of the area
   *                 logicalGate:
   *                   type: string
   *                   description: Logical gate for the area
   *                 primaryColor:
   *                   type: string
   *                   description: Primary color of the area.
   *                 secondaryColor:
   *                   type: string
   *                   description: Secondary color of the area.
   *                 icon:
   *                   type: string
   *                   description: Icon path of the area.
   *                 Actions:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: Unique ID of the action
   *                       triggered:
   *                         type: boolean
   *                         description: Whether the action is triggered or not
   *                       Action:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             description: Unique ID of the action type
   *                           name:
   *                             type: string
   *                             description: Name of the action type
   *                           isEnable:
   *                             type: boolean
   *                             description: Whether the action type is enabled or not
   *                       ActionParameters:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             id:
   *                               type: string
   *                               description: Unique ID of the action parameter
   *                             Parameter:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                   type: string
   *                                   description: Unique ID of the action parameter type
   *                                 name:
   *                                   type: string
   *                                   description: Name of the action parameter type
   *                             value:
   *                               type: string
   *                               description: Value of the action parameter
   *                 Reactions:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: Unique ID of the reaction
   *                       Reaction:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             description: Unique ID of the reaction type
   *                           name:
   *                             type: string
   *                             description: Name of the reaction type
   *                           isEnable:
   *                             type: boolean
   *                             description: Whether the reaction type is enabled or not
   *                       ReactionParameters:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             id:
   *                               type: string
   *                               description: Unique ID of the reaction parameter
   *                             Parameter:
   *                               type: object
   *                               properties:
   *                                 id:
   *                                   type: string
   *                                   description: Unique ID of the reaction parameter type
   *                                 name:
   *                                   type:
   *                                   description: Name of the reaction parameter type
   *                                 value:
   *                                   type: string
   *                                   description: Value of the reaction parameter
   *       '400':
   *         description: Incomplete request body or area name already exists for the user
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: An other AREA already have this name.
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: An error occurred while creating the area.
   */
  app.post(
    '/api/area',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (!req.body || !('name' in req.body) || !('isEnable' in req.body))
          return res.status(400).json({ error: 'Imcomplete body' })
        if (
          await checkAreaNameAlreadyExistForGivenUser(
            req.user.id,
            req.body.name,
            null
          )
        ) {
          return res
            .status(400)
            .json({ error: 'An other AREA already have this name.' })
        }
        const newArea = await database.prisma.AREA.create({
          data: {
            name: req.body.name,
            description: 'description' in req.body ? req.body.description : '',
            isEnable: req.body.isEnable,
            logicalGate:
              'logicalGate' in req.body ? req.body.logicalGate : 'OR',
            User: { connect: { id: req.user.id } },
            primaryColor:
              'primaryColor' in req.body ? req.body.primaryColor : '#000000',
            secondaryColor:
              'secondaryColor' in req.body
                ? req.body.secondaryColor
                : '#000000',
            icon: 'iconPath' in req.body ? req.body.iconPath : ''
          }
        })
        res.status(200).json(newArea)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @swagger
   * /api/area/{id}:
   *   put:
   *     summary: Update an area
   *     description: Update the name, description, logical gate, and enablement status of an area.
   *     tags:
   *       - Area
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the area to update.
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       description: Area object to be updated.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The new name of the area.
   *               isEnable:
   *                 type: boolean
   *                 description: The new enablement status of the area.
   *               description:
   *                 type: string
   *                 description: The new description of the area.
   *               logicalGate:
   *                 type: string
   *                 description: The new logical gate of the area. Defaults to "OR" if not provided.
   *               primaryColor:
   *                 type: string
   *                 example: #000000
   *               secondaryColor:
   *                 type: string
   *                 example: #0000f0
   *               iconPath:
   *                 type: string
   *                 example: assets/icons/.png
   *             example:
   *               name: New Area Name
   *               isEnable: true
   *               description: This is the updated description for the area.
   *               logicalGate: AND
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   description: The ID of the updated area.
   *                 name:
   *                   type: string
   *                   description: The new name of the area.
   *                 isEnable:
   *                   type: boolean
   *                   description: The new enablement status of the area.
   *                 description:
   *                   type: string
   *                   description: The new description of the area.
   *                 logicalGate:
   *                   type: string
   *                   description: The new logical gate of the area.
   *                 primaryColor:
   *                   type: string
   *                   description: The new primary color of the area.
   *                 secondaryColor:
   *                   type: string
   *                   description: The new secondary color of the area.
   *                 icon:
   *                   type: string
   *                   description: The new icon path of the area.
   *               example:
   *                 id: 123
   *                 name: New Area Name
   *                 isEnable: true
   *                 description: This is the updated description for the area.
   *                 logicalGate: AND
   *                 primaryColor: #000000
   *                 secondaryColor: #000000
   *                 icon: assets/icons/.png
   *       '400':
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: The error message.
   *               example:
   *                 error: Imcomplete body
   *       '404':
   *         description: Not Found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: The error message.
   *               example:
   *                 error: Area not found
   *       '500':
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: The error message.
   *               example:
   *                 error: Internal Server Error
   */
  app.put(
    '/api/area/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (!req.body || !('name' in req.body) || !('isEnable' in req.body))
          return res.status(400).json({ error: 'Imcomplete body' })
        if (
          await checkAreaNameAlreadyExistForGivenUser(
            req.user.id,
            req.body.name,
            req.params.id
          )
        )
          return res
            .status(400)
            .json({ error: 'An other AREA already have this name.' })
        let updatedArea = await database.prisma.AREA.findUnique({
          where: {
            id: req.params.id
          }
        })
        if (!updatedArea || req.user.id != updatedArea.userId)
          return res.status(404).json({ error: 'Area not found' })

        updatedArea = await database.prisma.AREA.update({
          where: {
            id: req.params.id
          },
          data: {
            name: req.body.name,
            isEnable: req.body.isEnable,
            updatedAt: new Date(),
            description: 'description' in req.body ? req.body.description : '',
            logicalGate:
              'logicalGate' in req.body ? req.body.logicalGate : 'OR',
            primaryColor:
              'primaryColor' in req.body ? req.body.primaryColor : '#000000',
            secondaryColor:
              'secondaryColor' in req.body
                ? req.body.secondaryColor
                : '#000000',
            icon: 'iconPath' in req.body ? req.body.iconPath : ''
          },
          select: {
            isEnable: true,
            userId: true,
            Actions: {
              select: {
                id: true,
                triggered: true,
                Action: {
                  select: {
                    id: true,
                    name: true,
                    isEnable: true,
                    code: true
                  }
                },
                ActionParameters: {
                  select: {
                    id: true,
                    Parameter: {
                      select: {
                        name: true
                      }
                    },
                    value: true
                  }
                }
              }
            }
          }
        })
        for (let action in updatedArea.Actions) {
          if (updatedArea.Actions[action].triggered) {
            updateTriggeredLink(updatedArea.Actions[action].id, false)
          }
        }
        for (let action of updatedArea.Actions) {
          if (updatedArea.isEnable && TriggerInitMap[action.Action.code])
            TriggerInitMap[action.Action.code](action)
          if (!updatedArea.isEnable && TriggerDestroyMap[action.Action.code])
            TriggerDestroyMap[action.Action.code](action)
        }
        res.status(200).json(updatedArea)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @swagger
   * /api/area/{id}:
   *   delete:
   *     summary: Delete an area by ID
   *     description: Deletes an area and its associated actions from the database.
   *     tags: [Area]
   *     security:
   *       - jwt: []
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the area to delete
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: The deleted area object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Area'
   *       400:
   *         description: Bad request, invalid input parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/BadRequest'
   *       401:
   *         description: Unauthorized, missing or invalid authentication credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/Unauthorized'
   *       404:
   *         description: The area with the specified ID was not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/NotFound'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/InternalServerError'
   */
  app.delete(
    '/api/area/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        let deletedArea = await database.prisma.AREA.findUnique({
          where: {
            id: req.params.id
          }
        })
        if (!deletedArea || req.user.id != deletedArea.userId)
          return res.status(404).json({ error: 'Area not found' })

        const oldArea = await database.prisma.AREA.delete({
          where: {
            id: req.params.id
          },
          select: {
            Actions: {
              select: {
                id: true,
                Action: {
                  select: {
                    code: true
                  }
                }
              }
            }
          }
        })
        oldArea.Actions.forEach(action => {
          if (TriggerDestroyMap[action.Action.code])
            TriggerDestroyMap[action.Action.code](action)
        })
        res.status(200).json(deletedArea)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )
}
