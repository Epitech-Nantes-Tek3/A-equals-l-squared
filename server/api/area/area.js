'use strict'

module.exports = function (app, passport, database) {
  /**
   * @api {get} /api/area Get all areas
   * @apiSuccess {Number} id Area unique ID.
   * @apiSuccess {String} name Area name.
   * @apiSuccess {Boolean} isEnable Area is enable.
   * @apiSuccess {Object} Action Action object.
   * @apiSuccess {String} Action.name Action name.
   * @apiSuccess {Boolean} Action.isEnable Action is enable.
   * @apiSuccess {Object[]} ActionParameters Action parameters.
   * @apiSuccess {Object} ActionParameters.Parameter Action parameter.
   * @apiSuccess {String} ActionParameters.Parameter.name Action parameter name.
   * @apiSuccess {String} ActionParameters.value Action parameter value.
   * @apiSuccess {Object[]} Reactions Reactions object.
   * @apiSuccess {Object} Reactions.Reaction Reaction object.
   * @apiSuccess {String} Reactions.Reaction.name Reaction name.
   * @apiSuccess {Boolean} Reactions.Reaction.isEnable Reaction is enable.
   * @apiSuccess {Object[]} Reactions.ReactionParameters Reaction parameters.
   * @apiSuccess {Object} Reactions.ReactionParameters.Parameter Reaction parameter.
   * @apiSuccess {String} Reactions.ReactionParameters.Parameter.name Reaction parameter name.
   * @apiSuccess {String} Reactions.ReactionParameters.value Reaction parameter value.
   * @apiFailure {String} error Error message.
   */
  app.get(
    '/api/area',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const areas = await database.prisma.AREA.findMany({
          select: {
            id: true,
            name: true,
            isEnable: true,
            description: true,
            Action: {
              select: {
                name: true,
                isEnable: true
              }
            },
            ActionParameters: {
              select: {
                Parameter: {
                  select: {
                    name: true
                  }
                },
                value: true
              }
            },
            Reactions: {
              select: {
                Reaction: {
                  select: {
                    name: true,
                    isEnable: true
                  }
                },
                ReactionParameters: {
                  select: {
                    Parameter: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        })
        res.status(200).json(areas)
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @api {get} /api/area/:id Get area by id
   * @apiParam {Number} id Area unique ID.
   * @apiSuccess {Number} id Area unique ID.
   * @apiSuccess {String} name Area name.
   * @apiSuccess {Boolean} isEnable Area is enable.
   * @apiSuccess {Object} Action Action object.
   * @apiSuccess {String} Action.name Action name.
   * @apiSuccess {Boolean} Action.isEnable Action is enable.
   * @apiSuccess {Object[]} ActionParameters Action parameters.
   * @apiSuccess {Object} ActionParameters.Parameter Action parameter.
   * @apiSuccess {String} ActionParameters.Parameter.name Action parameter name.
   * @apiSuccess {String} ActionParameters.value Action parameter value.
   * @apiSuccess {Object[]} Reactions Reactions object.
   * @apiSuccess {Object} Reactions.Reaction Reaction object.
   * @apiSuccess {String} Reactions.Reaction.name Reaction name.
   * @apiSuccess {Boolean} Reactions.Reaction.isEnable Reaction is enable.
   * @apiSuccess {Object[]} Reactions.ReactionParameters Reaction parameters.
   * @apiSuccess {Object} Reactions.ReactionParameters.Parameter Reaction parameter.
   * @apiSuccess {String} Reactions.ReactionParameters.Parameter.name Reaction parameter name.
   * @apiSuccess {String} Reactions.ReactionParameters.value Reaction parameter value.
   * @apiFailure {String} error Error message.
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
            Action: {
              select: {
                name: true,
                isEnable: true
              }
            },
            ActionParameters: {
              select: {
                Parameter: {
                  select: {
                    name: true
                  }
                },
                value: true
              }
            },
            Reactions: {
              select: {
                Reaction: {
                  select: {
                    name: true,
                    isEnable: true
                  }
                },
                ReactionParameters: {
                  select: {
                    Parameter: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        })
        res.status(200).json(area)
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @api {post} /api/area/create Create area
   * @apiParam {String} name Area name.
   * @apiParam {String} [description] Area description.
   * @apiParam {Boolean} isEnable Area is enable.
   * @apiSuccess {Number} id Area unique ID.
   * @apiSuccess {String} name Area name.
   * @apiSuccess {String} description Area description.
   * @apiSuccess {Boolean} isEnable Area is enable.
   * @apiFailure {String} error Error message.
   */
  app.post(
    '/api/area',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const newArea = await database.prisma.AREA.create({
          data: {
            name: req.body.name,
            description: 'description' in req.body ? req.body.description : '',
            isEnable: req.body.isEnable,
            User: { connect: { id: req.user.id } }
          }
        })
        res.status(200).json(newArea)
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }
  )

  /**
   * @api {post} /api/area/:id Delete area
   * @apiParam {Number} id Area unique ID.
   * @apiSuccess {Number} id Area unique ID.
   * @apiSuccess {String} name Area name.
   * @apiSuccess {String} description Area description.
   * @apiSuccess {Boolean} isEnable Area is enable.
   * @apiFailure {String} error Error message.
   */
  app.delete('/api/area/:id', async (req, res) => {
    try {
      const deletedArea = await database.prisma.AREA.delete({
        where: {
          id: req.params.id
        }
      })
      res.status(200).json(deletedArea)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  /**
   * @api {post} /api/area/:id Update area
   * @apiParam {Number} id Area unique ID.
   * @apiParam {String} name Area name.
   * @apiParam {Boolean} isEnable Area is enable.
   * @apiParam {String} [description] Area description.
   * @apiSuccess {Number} id Area unique ID.
   * @apiSuccess {String} name Area name.
   * @apiSuccess {String} description Area description.
   * @apiSuccess {Boolean} isEnable Area is enable.
   * @apiFailure {String} error Error message.
   */
  app.put(
    '/api/area/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const updatedArea = await database.prisma.AREA.update({
          where: {
            id: req.params.id
          },
          data: {
            name: req.body.name,
            isEnable: req.body.isEnable,
            description: 'description' in req.body ? req.body.description : ''
          }
        })
        res.status(200).json(updatedArea)
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }
  )
}
