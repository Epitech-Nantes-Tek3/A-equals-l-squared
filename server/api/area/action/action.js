'use strict'

const {
  TriggerInitMap,
  TriggerDestroyMap
} = require('../../../services/timetime/init')

module.exports = function (app, passport, database) {
  /**
   * @api {get} /api/area/:areaId/action Get all actions
   * @apiParam {String} areaId Area id
   * @apiSuccess {Object[]} actions Actions
   * @apiSuccess {String} actions.id Action id
   * @apiSuccess {String} actions.name Action name
   * @apiSuccess {Boolean} actions.isEnable Action isEnable
   * @apiSuccess {Object[]} actions.ActionParameters Action parameters
   * @apiSuccess {Object} actions.ActionParameters.Parameter Action parameter
   * @apiSuccess {String} actions.ActionParameters.Parameter.id Parameter id
   * @apiSuccess {String} actions.ActionParameters.Parameter.name Parameter name
   * @apiSuccess {String} actions.ActionParameters.value Parameter value
   * @apiFailure {String} error Error message
   * @apiFailure {500} error Internal server error
   * @apiFailure {404} error Area not found
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
   * @api {get} /api/area/:areaId/action/:id Get action
   * @apiParam {String} areaId Area id
   * @apiParam {String} id id of a Action/Parameter set
   * @apiSuccess {Object} action Action
   * @apiSuccess {String} action.id Action id
   * @apiSuccess {String} action.name Action name
   * @apiSuccess {Boolean} action.isEnable Action isEnable
   * @apiSuccess {Object[]} action.ActionParameters Action parameters
   * @apiSuccess {Object} action.ActionParameters.Parameter Action parameter
   * @apiSuccess {String} action.ActionParameters.Parameter.id Parameter id
   * @apiSuccess {String} action.ActionParameters.Parameter.name Parameter name
   * @apiSuccess {String} action.ActionParameters.value Parameter value
   * @apiFailure {String} error Error message
   * @apiFailure {500} error Internal server error
   * @apiFailure {404} error Area not found
   * @apiFailure {404} error Action not found
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
   * @api {post} /api/area/:areaId/action Create action
   * @apiParam {String} areaId Area id
   * @apiParam {String} actionId Action id
   * @apiParam {Object[]} actionParameters Action parameters
   * @apiParam {String} actionParameters.id Parameter id
   * @apiParam {String} actionParameters.value Parameter value
   * @apiSuccess {Object} action Action
   * @apiSuccess {String} action.id Action id
   * @apiSuccess {String} action.name Action name
   * @apiSuccess {Boolean} action.isEnable Action isEnable
   * @apiSuccess {Object[]} action.ActionParameters Action parameters
   * @apiSuccess {Object} action.ActionParameters.Parameter Action parameter
   * @apiSuccess {String} action.ActionParameters.Parameter.id Parameter id
   * @apiSuccess {String} action.ActionParameters.Parameter.name Parameter name
   * @apiSuccess {String} action.ActionParameters.value Parameter value
   * @apiFailure {String} error Error message
   * @apiFailure {404} Area not found
   * @apiFailure {404} Action not found
   * @apiFailure {500} Internal server error
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
          return res.status(400).json({ error: 'Imcomplete body' })
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
   * @api {delete} /api/area/:areaId/action/:id Delete action
   * @apiParam {String} areaId Area id
   * @apiParam {String} id id of a Action/Parameter set
   * @apiSuccess {Object} action Deleted action
   * @apiSuccess {String} action.id Action id
   * @apiSuccess {String} action.name Action name
   * @apiSuccess {Boolean} action.isEnable Action isEnable
   * @apiSuccess {Object[]} action.actionParameters Action parameters
   * @apiSuccess {String} action.actionParameters.id Parameter id
   * @apiSuccess {String} action.actionParameters.name Parameter name
   * @apiSuccess {String} action.actionParameters.value Parameter value
   * @apiFailure {404} Area not found
   * @apiFailure {404} Action not found
   * @apiFailure {500} Internal server error
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
   * @api {put} /api/area/:areaId/action/:id Update action
   * @apiParam {String} areaId Area id
   * @apiParam {String} id id of a Action/Parameter set
   * @apiParam {Object[]} actionParameters Action parameters
   * @apiParam {String} actionParameters.id Parameter id
   * @apiParam {String} actionParameters.value Parameter value
   * @apiSuccess {Object} action Updated action
   * @apiSuccess {String} action.id Action id
   * @apiSuccess {String} action.name Action name
   * @apiSuccess {Boolean} action.isEnable Action isEnable
   * @apiSuccess {Object[]} action.actionParameters Action parameters
   * @apiSuccess {String} action.actionParameters.id Parameter id
   * @apiSuccess {String} action.actionParameters.name Parameter name
   * @apiSuccess {String} action.actionParameters.value Parameter value
   * @apiFailure {404} Area not found
   * @apiFailure {404} Action not found
   * @apiFailure {500} Internal server error
   */
  app.put(
    '/api/area/:areaId/action/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (!req.body || !('actionParameters' in req.body))
          return res.status(400).json({ error: 'Imcomplete body' })
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

        const response = new Promise((resolve, reject) => {
          let updatedActionParameters = []
          req.body.actionParameters.forEach(async param => {
            const a = await database.prisma.ActionParameter.update({
              where: {
                id: param.id
              },
              data: {
                value: param.value
              }
            })
            updatedActionParameters.push(a)
          })
          resolve(updatedActionParameters)
        })
        const action = await database.prisma.AREAhasActions.findUnique({
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
