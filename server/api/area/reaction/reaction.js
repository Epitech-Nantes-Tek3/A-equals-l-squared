'use strict'

const app = require('../../../server_app')
const database = require('../../../database_init')

/**
 * @api {get} /api/area/:areaId/reactions Get reactions by area id
 * @apiParam {Number} areaId Area unique ID.
 * @apiSuccess {Object[]} Reactions Reactions object.
 * @apiSuccess {Object} Reactions.Reaction Reaction object.
 * @apiSuccess {Number} Reactions.Reaction.id Reaction unique ID.
 * @apiSuccess {String} Reactions.Reaction.name Reaction name.
 * @apiSuccess {Boolean} Reactions.Reaction.isEnable Reaction is enable.
 * @apiSuccess {Object[]} Reactions.ReactionParameters Reaction parameters.
 * @apiSuccess {Object} Reactions.ReactionParameters.Parameter Reaction parameter.
 * @apiSuccess {String} Reactions.ReactionParameters.Parameter.name Reaction parameter name.
 * @apiSuccess {String} Reactions.ReactionParameters.value Reaction parameter value.
 * @apiFailure {String} error Error message.
 */
app.get('/api/area/:areaId/reactions', async (req, res) => {
  try {
    const reactions = await database.prisma.AREAhasReactions.findMany({
      where: {
        AREA: {
          id: Number(req.params.areaId)
        }
      },
      select: {
        Reaction: {
          select: {
            id: true,
            name: true,
            isEnable: true,
            ReactionParameters: {
              select: {
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
    res.status(200).json(reactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @api {get} /api/area/:areaId/reaction/:id:id Get reaction by id
 * @apiParam {Number} areaId AREA unique ID.
 * @apiParam {Number} id Reaction unique ID.
 * @apiSuccess {Object} Reaction Reaction object.
 * @apiSuccess {Object} Reaction.Reaction Reaction object.
 * @apiSuccess {Number} Reaction.Reaction.id Reaction unique ID.
 * @apiSuccess {String} Reaction.Reaction.name Reaction name.
 * @apiSuccess {Boolean} Reaction.Reaction.isEnable Reaction is enable.
 * @apiSuccess {Object[]} Reaction.ReactionParameters Reaction parameters.
 * @apiSuccess {Object} Reaction.ReactionParameters.Parameter Reaction parameter.
 * @apiSuccess {String} Reaction.ReactionParameters.Parameter.name Reaction parameter name.
 * @apiSuccess {String} Reaction.ReactionParameters.value Reaction parameter value.
 * @apiFailure {String} error Error message.
 */
app.get('/api/area/:areaId/reaction/:id', async (req, res) => {
  try {
    const reaction = await database.prisma.AREAhasReactions.findUnique({
      where: {
        id: Number(req.params.id)
      },
      select: {
        Reaction: {
          select: {
            id: true,
            name: true,
            isEnable: true,
            ReactionParameters: {
              select: {
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
    res.status(200).json(reaction)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @api {post} /api/area/:areaId/reaction/create Create reaction
 * @apiParam {Number} areaId Area unique ID.
 * @apiParam {Number} reactionId Reaction unique ID.
 * @apiParam {Object[]} reactionParameters Reaction parameters.
 * @apiParam {Number} reactionParameters.id Reaction parameter unique ID.
 * @apiParam {String} reactionParameters.value Reaction parameter value.
 * @apiSuccess {Object} Reaction Reaction object.
 * @apiSuccess {Number} Reaction.id Reaction unique ID.
 * @apiFailure {String} error Error message.
 */
app.post('/api/area/:areaId/reaction/create', async (req, res) => {
  try {
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
            id: Number(req.params.areaId)
          }
        },
        Reaction: {
          connect: {
            id: Number(req.body.reactionId)
          }
        },
        ReactionParameters: {
          create: ReactionParameters
        }
      }
    })
    res.status(200).json(reaction)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @api {post} /api/area/:areaId/reaction/:id/delete Delete reaction
 * @apiParam {Number} id Reaction unique ID.
 * @apiSuccess {Object} Reaction Reaction object.
 * @apiSuccess {Number} Reaction.id Reaction unique ID.
 * @apiFailure {String} error Error message.
 */
app.post('/api/area/:areaId/reaction/:id/delete', async (req, res) => {
  try {
    const reaction = await database.prisma.AREAhasReactions.delete({
      where: {
        id: Number(req.params.id)
      }
    })
    res.status(200).json(reaction)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @api {post} /api/area/:areaId/reaction/:id/update Update reaction
 * @apiParam {Number} id Reaction unique ID.
 * @apiParam {Object[]} reactionParameters Reaction parameters.
 * @apiParam {Number} reactionParameters.id Reaction parameter unique ID.
 * @apiParam {String} reactionParameters.value Reaction parameter value.
 * @apiSuccess {Object[]} ReactionParameters Reaction parameters.
 * @apiSuccess {Number} ReactionParameters.id Reaction parameter unique ID.
 * @apiSuccess {String} ReactionParameters.value Reaction parameter value.
 * @apiFailure {String} error Error message.
 */
app.post('/api/area/:areaId/reaction/:id/update', async (req, res) => {
  try {
    const updatedParams = []

    await Promise.all(
      req.body.reactionParameters.map(async param => {
        const updatedParam = await database.prisma.ReactionParameters.update({
          where: {
            id: Number(param.id)
          },
          data: {
            value: param.value
          }
        })
        updatedParams.push(updatedParam)
      })
    )
    res.status(200).json(updatedParams)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
