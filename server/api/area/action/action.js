'use strict'

const {
  TriggerInitMap,
  TriggerDestroyMap
} = require('../../../services/timetime/init')

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * /api/area/{areaId}/action:
   *   get:
   *     summary: Get actions for a specific area
   *     description: Returns a list of actions and their parameters for a specific area.
   *     tags:
   *       - Actions
   *     security:
   *       - jwt: []
   *     parameters:
   *       - name: areaId
   *         in: path
   *         required: true
   *         description: The ID of the area to retrieve actions for.
   *         schema:
   *           type: string
   *           example: "abc123"
   *     responses:
   *       200:
   *         description: Successfully retrieved actions for the area.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     description: The ID of the AREAhasActions record.
   *                     example: "abc123"
   *                   Action:
   *                     type: object
   *                     description: The action associated with the AREAhasActions record.
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: The ID of the action.
   *                         example: "def456"
   *                       name:
   *                         type: string
   *                         description: The name of the action.
   *                         example: "Send email"
   *                       isEnable:
   *                         type: boolean
   *                         description: Indicates whether the action is currently enabled or disabled.
   *                         example: true
   *                   ActionParameters:
   *                     type: array
   *                     description: The parameters associated with the action.
   *                     items:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           description: The ID of the ActionParameters record.
   *                           example: "ghi789"
   *                         Parameter:
   *                           type: object
   *                           description: The parameter associated with the ActionParameters record.
   *                           properties:
   *                             name:
   *                               type: string
   *                               description: The name of the parameter.
   *                               example: "To"
   *                         value:
   *                           type: string
   *                           description: The value of the parameter.
   *                           example: "john.doe@example.com"
   *       404:
   *         description: Area not found or user is not authorized to access the area.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: The error message.
   *                   example: "Area not found"
   *       500:
   *         description: An error occurred while retrieving the actions.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: The error message.
   *                   example: "Internal server error"
   */
  app.get(
    '/api/area/:areaId/action',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const area = await database.prisma.AREA.findUnique({
          where: {
            id: req.params.areaId
          },
          select: {
            userId: true
          }
        })
        if (!area || area.userId !== req.user.id)
          return res.status(404).json({ error: 'Area not found' })

        const actions = await database.prisma.AREAhasActions.findMany({
          where: {
            AREA: {
              id: req.params.areaId
            }
          },
          select: {
            id: true,
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
                    name: true
                  }
                },
                value: true
              }
            }
          }
        })
        res.status(200).json(actions)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @swagger
   * /api/area/{areaId}/action/{id}:
   *   get:
   *     tags: [Area/Action]
   *     summary: Get an action by ID for a specific area
   *     security:
   *       - jwt: []
   *     parameters:
   *       - in: path
   *         name: areaId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the area
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the action
   *     responses:
   *       '200':
   *         description: OK. Returns the action.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 Action:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       description: Action ID.
   *                     name:
   *                       type: string
   *                       description: Action name.
   *                     isEnable:
   *                       type: boolean
   *                       description: Whether the action is enabled.
   *                   required:
   *                     - id
   *                     - name
   *                     - isEnable
   *                 ActionParameters:
   *                   type: array
   *                   description: Array of action parameters.
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: Parameter ID.
   *                       Parameter:
   *                         type: object
   *                         properties:
   *                           name:
   *                             type: string
   *                             description: Parameter name.
   *                         required:
   *                           - name
   *                       value:
   *                         type: string
   *                         description: Parameter value.
   *                   required:
   *                     - id
   *                     - Parameter
   *                     - value
   *       '404':
   *         description: Not found. Either the area or the action was not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message.
   *                   example: "Area not found"
   *       '500':
   *         description: Internal server error. An unexpected error occurred.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message.
   *                   example: "Internal server error"
   */
  app.get(
    '/api/area/:areaId/action/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const area = await database.prisma.AREA.findUnique({
          where: {
            id: req.params.areaId
          },
          select: {
            userId: true
          }
        })
        if (!area || area.userId !== req.user.id)
          return res.status(404).json({ error: 'Area not found' })

        const action = await database.prisma.AREAhasActions.findUnique({
          where: {
            id: req.params.id
          },
          select: {
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
                    name: true
                  }
                },
                value: true
              }
            }
          }
        })
        if (!action) return res.status(404).json({ error: 'Action not found' })
        res.status(200).json(action)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @swagger
   * /api/area/:areaId/action:
   *   post:
   *     tags: [Area/Action]
   *     summary: Create an action for a specific area
   *     security:
   *       - jwt: []
   *     parameters:
   *       - in: path
   *         name: areaId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the area
   *       - in: body
   *         name: action
   *         description: The action to create
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             actionId:
   *               type: string
   *               description: ID of the action
   *             actionParameters:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     description: ID of the parameter
   *                   value:
   *                     type: string
   *                     description: Value of the parameter
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Successfully created an action
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: string
   *               description: ID of the created action
   *             Action:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: ID of the action
   *                 name:
   *                   type: string
   *                   description: Name of the action
   *                 isEnable:
   *                   type: boolean
   *                   description: Flag indicating whether the action is enabled or not
   *                 ActionParameters:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: ID of the parameter
   *                       Parameter:
   *                         type: object
   *                         properties:
   *                           name:
   *                             type: string
   *                             description: Name of the parameter
   *                       value:
   *                         type: string
   *                         description: Value of the parameter
   *       400:
   *         description: Incomplete body or invalid parameter list
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               description: Error message
   *       404:
   *         description: Area not found or Action not found
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               description: Error message
   *       500:
   *         description: Internal server error
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               description: Error message
   */
  app.post(
    '/api/area/:areaId/action',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (
          !req.body ||
          !('actionParameters' in req.body) ||
          !('actionId' in req.body)
        )
          return res.status(400).json({ error: 'Incomplete body' })
        const area = await database.prisma.AREA.findUnique({
          where: {
            id: req.params.areaId
          },
          select: {
            isEnable: true,
            userId: true
          }
        })
        if (!area || area.userId !== req.user.id)
          return res.status(404).json({ error: 'Area not found' })

        const ActionParameters = []
        req.body.actionParameters.forEach(param => {
          ActionParameters.push({
            Parameter: { connect: { id: param.id } },
            value: param.value
          })
        })

        const action = await database.prisma.AREAhasActions.create({
          data: {
            AREA: {
              connect: {
                id: req.params.areaId
              }
            },
            Action: {
              connect: {
                id: req.body.actionId
              }
            },
            ActionParameters: {
              create: ActionParameters
            }
          },
          select: {
            id: true,
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
        })
        if (area.isEnable && TriggerInitMap[action.Action.code]) {
          if (!TriggerInitMap[action.Action.code](action)) {
            await database.prisma.AREAhasActions.delete({
              where: { id: action.id }
            })
            return res.status(400).send('Please pass a valid parameter list !')
          }
        }
        res.status(200).json(action)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @swagger
   * /api/area/{areaId}/action/{id}:
   *   delete:
   *     tags: [Area/Action]
   *     summary: Delete an action/parameter set for a specific area
   *     description: Deletes the action/parameter set with the specified ID for the area with the specified area ID.
   *     parameters:
   *       - in: path
   *         name: areaId
   *         required: true
   *         description: ID of the area
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the action/parameter set
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: OK. Returns the deleted action/parameter set.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: ID of the deleted action/parameter set
   *                 name:
   *                   type: string
   *                   description: Name of the deleted action/parameter set
   *                 isEnable:
   *                   type: boolean
   *                   description: Whether the deleted action/parameter set was enabled
   *                 actionParameters:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: ID of the parameter
   *                       name:
   *                         type: string
   *                         description: Name of the parameter
   *                       value:
   *                         type: string
   *                         description: Value of the parameter
   *       '404':
   *         description: Not found. Either the specified area or the specified action/parameter set does not exist.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Description of the error
   *       '500':
   *         description: Internal server error. An error occurred while deleting the action/parameter set.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Description of the error
   */
  app.delete(
    '/api/area/:areaId/action/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const area = await database.prisma.AREA.findUnique({
          where: {
            id: req.params.areaId
          },
          select: {
            userId: true,
            Actions: {
              select: {
                id: true
              }
            }
          }
        })
        if (!area || area.userId !== req.user.id)
          return res.status(404).json({ error: 'Area not found' })
        if (!area.Actions.find(action => action.id === req.params.id))
          return res.status(404).json({ error: 'Action not found' })

        const action = await database.prisma.AREAhasActions.delete({
          where: {
            id: req.params.id
          },
          select: {
            id: true,
            Action: {
              select: {
                code: true
              }
            }
          }
        })
        if (TriggerDestroyMap[action.Action.code])
          TriggerDestroyMap[action.Action.code](action)
        res.status(200).json(action)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @swagger
   * /api/area/{areaId}/action/{id}:
   *   put:
   *     tags: [Area/Action]
   *     summary: Update action
   *     parameters:
   *       - in: path
   *         name: areaId
   *         required: true
   *         description: Area id
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of a Action/Parameter set
   *         schema:
   *           type: string
   *       - in: body
   *         name: actionParameters
   *         required: true
   *         description: Action parameters
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 description: Parameter id
   *               value:
   *                 type: string
   *                 description: Parameter value
   *     security:
   *       - jwt: []
   *     responses:
   *       "200":
   *         description: Updated action
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 action:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       description: Action id
   *                     name:
   *                       type: string
   *                       description: Action name
   *                     isEnable:
   *                       type: boolean
   *                       description: Action isEnable
   *                     actionParameters:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             description: Parameter id
   *                           name:
   *                             type: string
   *                             description: Parameter name
   *                           value:
   *                             type: string
   *                             description: Parameter value
   *       "400":
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message
   *       "404":
   *         description: Not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message
   *       "500":
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message
   */
  app.put(
    '/api/area/:areaId/action/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (!req.body || !('actionParameters' in req.body))
          return res.status(400).json({ error: 'Incomplete body' })
        const area = await database.prisma.AREA.findUnique({
          where: {
            id: req.params.areaId
          },
          select: {
            isEnable: true,
            userId: true,
            Actions: {
              select: {
                id: true
              }
            }
          }
        })
        if (!area || area.userId !== req.user.id)
          return res.status(404).json({ error: 'Area not found' })
        if (!area.Actions.find(action => action.id === req.params.id))
          return res.status(404).json({ error: 'Action not found' })

        const response = await new Promise(async (resolve, reject) => {
          let updatedActionParameters = []
          for await (let param of req.body.actionParameters) {
            const a = await database.prisma.ActionParameter.update({
              where: {
                id: param.id
              },
              data: {
                value: param.value
              }
            })
            updatedActionParameters.push(a)
          }
          resolve(updatedActionParameters)
        })
        const action = await database.prisma.AREAhasActions.update({
          where: {
            id: req.params.id
          },
          data: {
            triggered: false
          },
          select: {
            id: true,
            triggered: true,
            Action: {
              select: {
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
        })
        if (TriggerDestroyMap[action.Action.code])
          TriggerDestroyMap[action.Action.code](action)
        if (area.isEnable && TriggerInitMap[action.Action.code])
          if (!TriggerInitMap[action.Action.code](action))
            return res.status(400).send('Please pass a valid parameter list !')
        res.status(200).json(response)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )
}
