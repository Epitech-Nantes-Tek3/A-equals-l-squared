'use strict'

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * /api/area/{areaId}/reaction:
   *   get:
   *     tags: [Area/Reaction]
   *     summary: Get all reactions for an area
   *     description: Retrieve all reactions associated with a given area ID.
   *     parameters:
   *       - name: areaId
   *         in: path
   *         description: ID of the area to retrieve reactions for
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of reactions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Reaction'
   *       404:
   *         description: Area not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Area not found
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *     security:
   *       - jwt: []
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
   * @swagger
   * /api/area/{areaId}/reaction/{id}:
   *   get:
   *     tags: [Area/Reaction]
   *     summary: Get a reaction
   *     description: Get a specific reaction and its parameters for a given area
   *     parameters:
   *       - in: path
   *         name: areaId
   *         description: The ID of the area to retrieve the reaction from
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         description: The ID of the reaction to retrieve
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 Reaction:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       description: The ID of the reaction
   *                     name:
   *                       type: string
   *                       description: The name of the reaction
   *                     isEnable:
   *                       type: boolean
   *                       description: Whether the reaction is enabled or not
   *                 ReactionParameters:
   *                   type: array
   *                   description: An array of parameter objects for the reaction
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: The ID of the parameter
   *                       Parameter:
   *                         type: object
   *                         properties:
   *                           name:
   *                             type: string
   *                             description: The name of the parameter
   *                       value:
   *                         type: string
   *                         description: The value of the parameter
   *       '404':
   *         description: Not found
   *       '500':
   *         description: Internal Server Error
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
   * @swagger
   * /api/area/{areaId}/reaction:
   *   post:
   *     tags: [Area/Reaction]
   *     summary: Create reaction
   *     parameters:
   *       - in: path
   *         name: areaId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the area
   *       - in: body
   *         name: reaction
   *         description: Reaction object
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             reactionId:
   *               type: string
   *             reactionParameters:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   value:
   *                     type: string
   *     responses:
   *       '200':
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: Reaction id
   *                 name:
   *                   type: string
   *                   description: Reaction name
   *                 isEnable:
   *                   type: boolean
   *                   description: Reaction isEnable
   *                 ReactionParameters:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       Parameter:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             description: Parameter id
   *                           name:
   *                             type: string
   *                             description: Parameter name
   *                       value:
   *                         type: string
   *                         description: Parameter value
   *       '400':
   *         description: Invalid input
   *       '404':
   *         description: Area or Reaction not found
   *       '500':
   *         description: Internal server error
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
          return res.status(400).json({ error: 'Incomplete body' })
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
   * @swagger
   * /api/area/{areaId}/reaction/{id}:
   *   delete:
   *     tags: [Area/Reaction]
   *     summary: Delete reaction
   *     description: Deletes a reaction with the specified id and its parameters for the area with the specified areaId
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
   *         description: ID of the reaction/parameter set
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Deleted reaction
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: ID of the reaction
   *                 name:
   *                   type: string
   *                   description: Name of the reaction
   *                 isEnable:
   *                   type: boolean
   *                   description: Specifies if the reaction is enabled
   *                 reactionParameters:
   *                   type: array
   *                   description: An array of reaction parameters
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
   *       404:
   *         description: Area or Reaction not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message
   *       500:
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
   * @swagger
   * /api/area/{areaId}/reaction/{id}:
   *   put:
   *     tags: [Area/Reaction]
   *     summary: Update reaction
   *     description: Update a reaction with the specified ID in the area with the specified area ID
   *     parameters:
   *       - in: path
   *         name: areaId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the area to update the reaction in
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the reaction to update
   *       - in: body
   *         name: reactionParameters
   *         description: Reaction parameters to update
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: string
   *             value:
   *               type: string
   *           required:
   *             - id
   *             - value
   *     responses:
   *       '200':
   *         description: Updated reaction
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
   *                   isEnable:
   *                     type: boolean
   *                   reactionParameters:
   *                     type: array
   *                     items:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                         name:
   *                           type: string
   *                         value:
   *                           type: string
   *       '400':
   *         description: Incomplete body
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       '404':
   *         description: Area or Reaction not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  app.put(
    '/api/area/:areaId/reaction/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (!req.body || !('reactionParameters' in req.body))
          return res.status(400).json({ error: 'Incomplete body' })
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

        const response = new Promise(async (resolve, reject) => {
          let updatedReactionParameters = []
          for await (let param of req.body.reactionParameters) {
            const a = await database.prisma.ReactionParameter.update({
              where: {
                id: param.id
              },
              data: {
                value: param.value
              }
            })
            updatedReactionParameters.push(a)
          }
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
