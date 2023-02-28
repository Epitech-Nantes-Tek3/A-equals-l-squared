'use strict'

module.exports = function (app, passport, database) {
  /**
   * @api {get} /api/area/:areaId/reaction Get all reactions
   * @apiParam {String} areaId Area id
   * @apiSuccess {Object[]} reactions Reactions
   * @apiSuccess {String} reactions.id Reaction id
   * @apiSuccess {String} reactions.name Reaction name
   * @apiSuccess {Boolean} reactions.isEnable Reaction isEnable
   * @apiSuccess {Object[]} reactions.ReactionParameters Reaction parameters
   * @apiSuccess {Object} reactions.ReactionParameters.Parameter Reaction parameter
   * @apiSuccess {String} reactions.ReactionParameters.Parameter.id Parameter id
   * @apiSuccess {String} reactions.ReactionParameters.Parameter.name Parameter name
   * @apiSuccess {String} reactions.ReactionParameters.value Parameter value
   * @apiFailure {String} error Error message
   * @apiFailure {500} error Internal server error
   * @apiFailure {404} error Area not found
   */
  app.get(
    '/api/area/:areaId/reaction',
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

        const reactions = await database.prisma.AREAhasReactions.findMany({
          where: {
            AREA: {
              id: req.params.areaId
            }
          },
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
                    name: true
                  }
                },
                value: true
              }
            }
          }
        })
        res.status(200).json(reactions)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @api {get} /api/area/:areaId/reaction/:id Get reaction
   * @apiParam {String} areaId Area id
   * @apiParam {String} id id of a Reaction/Parameter set
   * @apiSuccess {Object} reaction Reaction
   * @apiSuccess {String} reaction.id Reaction id
   * @apiSuccess {String} reaction.name Reaction name
   * @apiSuccess {Boolean} reaction.isEnable Reaction isEnable
   * @apiSuccess {Object[]} reaction.ReactionParameters Reaction parameters
   * @apiSuccess {Object} reaction.ReactionParameters.Parameter Reaction parameter
   * @apiSuccess {String} reaction.ReactionParameters.Parameter.id Parameter id
   * @apiSuccess {String} reaction.ReactionParameters.Parameter.name Parameter name
   * @apiSuccess {String} reaction.ReactionParameters.value Parameter value
   * @apiFailure {String} error Error message
   * @apiFailure {500} error Internal server error
   * @apiFailure {404} error Area not found
   * @apiFailure {404} error Reaction not found
   */
  app.get(
    '/api/area/:areaId/reaction/:id',
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

        const reaction = await database.prisma.AREAhasReactions.findUnique({
          where: {
            id: req.params.id
          },
          select: {
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
                    name: true
                  }
                },
                value: true
              }
            }
          }
        })
        if (!reaction)
          return res.status(404).json({ error: 'Reaction not found' })
        res.status(200).json(reaction)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @api {post} /api/area/:areaId/reaction Create reaction
   * @apiParam {String} areaId Area id
   * @apiParam {String} reactionId Reaction id
   * @apiParam {Object[]} reactionParameters Reaction parameters
   * @apiParam {String} reactionParameters.id Parameter id
   * @apiParam {String} reactionParameters.value Parameter value
   * @apiSuccess {Object} reaction Reaction
   * @apiSuccess {String} reaction.id Reaction id
   * @apiSuccess {String} reaction.name Reaction name
   * @apiSuccess {Boolean} reaction.isEnable Reaction isEnable
   * @apiSuccess {Object[]} reaction.ReactionParameters Reaction parameters
   * @apiSuccess {Object} reaction.ReactionParameters.Parameter Reaction parameter
   * @apiSuccess {String} reaction.ReactionParameters.Parameter.id Parameter id
   * @apiSuccess {String} reaction.ReactionParameters.Parameter.name Parameter name
   * @apiSuccess {String} reaction.ReactionParameters.value Parameter value
   * @apiFailure {String} error Error message
   * @apiFailure {404} Area not found
   * @apiFailure {404} Reaction not found
   * @apiFailure {500} Internal server error
   */
  app.post(
    '/api/area/:areaId/reaction',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (
          !req.body ||
          !('reactionParameters' in req.body) ||
          !('reactionId' in req.body)
        )
          return res.status(400).json({ error: 'Imcomplete body' })
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

        const ReactionParameters = []
        req.body.reactionParameters.forEach(param => {
          ReactionParameters.push({
            Parameter: { connect: { id: param.id } },
            value: param.value
          })
        })

        const reaction = await database.prisma.AREAhasReactions.create({
          data: {
            AREA: {
              connect: {
                id: req.params.areaId
              }
            },
            Reaction: {
              connect: {
                id: req.body.reactionId
              }
            },
            ReactionParameters: {
              create: ReactionParameters
            }
          },
          select: {
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
                    name: true
                  }
                },
                value: true
              }
            }
          }
        })
        res.status(200).json(reaction)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @api {delete} /api/area/:areaId/reaction/:id Delete reaction
   * @apiParam {String} areaId Area id
   * @apiParam {String} id id of a Reaction/Parameter set
   * @apiSuccess {Object} reaction Deleted reaction
   * @apiSuccess {String} reaction.id Reaction id
   * @apiSuccess {String} reaction.name Reaction name
   * @apiSuccess {Boolean} reaction.isEnable Reaction isEnable
   * @apiSuccess {Object[]} reaction.reactionParameters Reaction parameters
   * @apiSuccess {String} reaction.reactionParameters.id Parameter id
   * @apiSuccess {String} reaction.reactionParameters.name Parameter name
   * @apiSuccess {String} reaction.reactionParameters.value Parameter value
   * @apiFailure {404} Area not found
   * @apiFailure {404} Reaction not found
   * @apiFailure {500} Internal server error
   */
  app.delete(
    '/api/area/:areaId/reaction/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const area = await database.prisma.AREA.findUnique({
          where: {
            id: req.params.areaId
          },
          select: {
            userId: true,
            Reactions: {
              select: {
                id: true
              }
            }
          }
        })
        if (!area || area.userId !== req.user.id)
          return res.status(404).json({ error: 'Area not found' })
        if (!area.Reactions.find(reaction => reaction.id === req.params.id))
          return res.status(404).json({ error: 'Reaction not found' })

        const reaction = await database.prisma.AREAhasReactions.delete({
          where: {
            id: req.params.id
          }
        })
        res.status(200).json(reaction)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @api {put} /api/area/:areaId/reaction/:id Update reaction
   * @apiParam {String} areaId Area id
   * @apiParam {String} id id of a Reaction/Parameter set
   * @apiParam {Object[]} reactionParameters Reaction parameters
   * @apiParam {String} reactionParameters.id Parameter id
   * @apiParam {String} reactionParameters.value Parameter value
   * @apiSuccess {Object} reaction Updated reaction
   * @apiSuccess {String} reaction.id Reaction id
   * @apiSuccess {String} reaction.name Reaction name
   * @apiSuccess {Boolean} reaction.isEnable Reaction isEnable
   * @apiSuccess {Object[]} reaction.reactionParameters Reaction parameters
   * @apiSuccess {String} reaction.reactionParameters.id Parameter id
   * @apiSuccess {String} reaction.reactionParameters.name Parameter name
   * @apiSuccess {String} reaction.reactionParameters.value Parameter value
   * @apiFailure {404} Area not found
   * @apiFailure {404} Reaction not found
   * @apiFailure {500} Internal server error
   */
  app.put(
    '/api/area/:areaId/reaction/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (!req.body || !('reactionParameters' in req.body))
          return res.status(400).json({ error: 'Imcomplete body' })
        const area = await database.prisma.AREA.findUnique({
          where: {
            id: req.params.areaId
          },
          select: {
            userId: true,
            Reactions: {
              select: {
                id: true
              }
            }
          }
        })
        if (!area || area.userId !== req.user.id)
          return res.status(404).json({ error: 'Area not found' })
        if (!area.Reactions.find(reaction => reaction.id === req.params.id))
          return res.status(404).json({ error: 'Reaction not found' })

        const response = new Promise((resolve, reject) => {
          let updatedReactionParameters = []
          req.body.reactionParameters.forEach(async param => {
            const a = await database.prisma.ReactionParameter.update({
              where: {
                id: param.id
              },
              data: {
                value: param.value
              }
            })
            updatedReactionParameters.push(a)
          })
          resolve(updatedReactionParameters)
        })
        res.status(200).json(response)
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
      }
    }
  )
}
