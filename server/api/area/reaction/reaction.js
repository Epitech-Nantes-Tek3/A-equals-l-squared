'use strict'

module.exports = function (app, passport, database) {
  app.get(
    '/api/area/:areaId/reaction',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
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
    }
  )

  app.get(
    '/api/area/:areaId/reaction/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
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
    }
  )

  app.post(
    '/api/area/:areaId/reaction',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
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
    }
  )

  app.delete(
    '/api/area/:areaId/reaction/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
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
    }
  )

  app.put(
    '/api/area/:areaId/reaction/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const updatedParams = []

        await Promise.all(
          req.body.reactionParameters.map(async param => {
            const updatedParam =
              await database.prisma.ReactionParameters.update({
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
    }
  )
}
