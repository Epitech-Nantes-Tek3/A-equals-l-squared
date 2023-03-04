'use strict'

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * /api/services/rea/getAvailableArea:
   *   get:
   *     tags: [Services/Rea]
   *     summary: List available area for rea service
   *     description: Retrieves the list of available areas for the rea service.
   *     security:
   *       - jwt: []
   *     responses:
   *       '200':
   *         description: A list of available areas for the rea service
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The status of the response
   *                   example: success
   *                 data:
   *                   type: array
   *                   description: The list of available areas
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         description: The ID of the area
   *                         example: 1
   *                       name:
   *                         type: string
   *                         description: The name of the area
   *                         example: Living Room
   *                 statusCode:
   *                   type: integer
   *                   description: The status code of the response
   *                   example: 200
   */
  app.get(
    '/api/services/rea/getAvailableArea',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const area = []
      const areas = await database.prisma.AREA.findMany({
        where: { userId: req.user.id }
      })
      areas.forEach(areaContent => {
        area.push({ id: areaContent.id, name: areaContent.name })
      })
      return res.status(200).json({
        status: 'success',
        data: area,
        statusCode: res.statusCode
      })
    }
  )

  /**
   * @swagger
   * /api/services/rea/getAvailableStatus:
   *   get:
   *     tags: [Services/Rea]
   *     summary: List available status for rea service
   *     description: Retrieves the list of available status for the rea service.
   *     security:
   *       - jwt: []
   *     responses:
   *       '200':
   *         description: A list of available status for the rea service
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The status of the response
   *                   example: success
   *                 data:
   *                   type: array
   *                   description: The list of available status
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: The ID of the status
   *                         example: True
   *                       name:
   *                         type: string
   *                         description: The name of the status
   *                         example: On
   *                 statusCode:
   *                   type: integer
   *                   description: The status code of the response
   *                   example: 200
   */
  app.get(
    '/api/services/rea/getAvailableStatus',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const status = []
      status.push({ id: 'True', name: 'On' })
      status.push({ id: 'False', name: 'Off' })
      return res.status(200).json({
        status: 'success',
        data: status,
        statusCode: res.statusCode
      })
    }
  )
}
