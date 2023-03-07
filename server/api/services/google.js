'use strict'

const getAvailableCalendars = require('../../services/calendar/getters/get_available_calendars')

module.exports = function (app, passport) {
  /**
   * @swagger
   * /api/services/gmail/getAvailablePerformers:
   *   get:
   *     tags: [Services/Gmail]
   *     summary: List available performers such as bot/user.
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         description: Returns the list of available performers.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "1234567890"
   *                       name:
   *                         type: string
   *                         example: "User Name"
   *                 statusCode:
   *                   type: number
   *                   example: 200
   *       400:
   *         description: No Google account linked or an error occurred.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "No Google account linked."
   *                 statusCode:
   *                   type: number
   *                   example: 400
   */
  app.get(
    '/api/services/gmail/getAvailablePerformers',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const performers = []
      if (req != null && req.user != null && req.user.googleToken != null)
        performers.push({ id: req.user.googleToken, name: req.user.username })
      performers.push({
        id: 'aequallsquared@gmail.com',
        name: 'Default Bot Gmail'
      })
      return res.status(200).json({
        status: 'success',
        data: performers,
        statusCode: res.statusCode
      })
    }
  )

  /**
   * @swagger
   * /api/services/calendar/getAvailableCalendars:
   *   get:
   *     tags: [Services/Calendar]
   *     summary: List all available Google calendars
   *     description: Returns a list of all available Google calendars linked to the user's account.
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         description: Calendars listed successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       summary:
   *                         type: string
   *                 statusCode:
   *                   type: number
   *                   example: 200
   *       400:
   *         description: Invalid or missing Google auth token.
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: "No Google account linked."
   *       500:
   *         description: An error occurred while processing the request.
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: "An error occurred."
   */
  app.get(
    '/api/services/calendar/getAvailableCalendars',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      console.dir(getAvailableCalendars(req.user.googleToken))
      if (req.user.googleToken == null)
        return res.status(400).send('No Google account linked.')
      try {
        const calendars = await getAvailableCalendars(req.user.googleToken)
        res.status(200).json({
          status: 'success',
          data: calendars,
          statusCode: res.statusCode
        })
      } catch (error) {
        res.status(400).send('An error occured.')
      }
    }
  )
}
