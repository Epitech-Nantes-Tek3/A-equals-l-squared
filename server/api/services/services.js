'use strict'

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * /api/get/Service:
   *   get:
   *     tags: [Services]
   *     summary: Get all enabled services sorted by creation date
   *     description: Returns a list of all enabled services sorted by creation date. Requires a valid JSON web token.
   *     security:
   *       - jwt: []
   *     responses:
   *       '200':
   *         description: Successful response with list of services
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Service'
   *       '401':
   *         description: Invalid token provided
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Invalid token
   *       '400':
   *         description: Service getter temporarily deactivated
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Service getter temporarily deactivated.
   */
  app.get(
    '/api/get/Service',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      if (!req.user) return res.status(401).send('Invalid token')
      try {
        const services = await database.prisma.Service.findMany({
          where: { isEnable: true },
          include: {
            Actions: { include: { Parameters: true, DynamicParameters: true } },
            Reactions: { include: { Parameters: true } }
          },
          orderBy: { createdAt: 'desc' }
        })
        return res.status(200).json({
          status: 'success',
          data: { services },
          statusCode: res.statusCode
        })
      } catch (err) {
        return res.status(400).send('Service getter temporarily desactivated.')
      }
    }
  )
}
