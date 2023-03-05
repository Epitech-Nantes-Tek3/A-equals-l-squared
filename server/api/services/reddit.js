'use strict'

const axios = require('axios')
require('dotenv').config({ path: '../../.env' })

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * /api/code/reddit:
   *   post:
   *     summary: Generate a Reddit token with a given code
   *     description: Generates a Reddit token with a given code and stores the refresh token in the database for the current user.
   *     tags: [Services/Reddit]
   *     security:
   *       - jwt: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               code:
   *                 type: string
   *                 description: The authorization code obtained from Reddit.
   *                 example: "123456"
   *     responses:
   *       200:
   *         description: Successfully generated a Reddit token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The status of the response.
   *                   example: "success"
   *                 data:
   *                   type: object
   *                   description: The data returned from the API.
   *                   properties:
   *                     access_token:
   *                       type: string
   *                       description: The Reddit access token.
   *                       example: "1234567890abcdefg"
   *                 statusCode:
   *                   type: number
   *                   description: The HTTP status code of the response.
   *                   example: 200
   *       400:
   *         description: Failed to generate a Reddit token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: The error message.
   *                   example: "Code generation has failed."
   */
  app.post(
    '/api/code/reddit',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      if (!req.user) return res.status(401).send('Invalid code')
      try {
        const postData = {
          grant_type: 'authorization_code',
          code: req.body.code,
          redirect_uri: 'http://localhost:8081/auth.html'
        }
        const authString = process.env.REDDIT_AUTH
        const authHeader = `Basic ${Buffer.from(authString).toString('base64')}`

        const ret = await axios.post(
          'https://www.reddit.com/api/v1/access_token',
          postData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: authHeader,
              'User-Agent': 'MyBot/1.0.0'
            }
          }
        )
        await database.prisma.User.update({
          where: { id: req.user.id },
          data: { redditRefreshToken: ret.data.refresh_token }
        })
        return res.status(200).json({
          status: 'success',
          data: { access_token: ret.data.access_token },
          statusCode: res.statusCode
        })
      } catch (err) {
        console.log(err)
        return res.status(400).send('Code generation has failed.')
      }
    }
  )
}
