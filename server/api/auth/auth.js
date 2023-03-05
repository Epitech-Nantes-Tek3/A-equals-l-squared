'use strict'

const utils = require('../../utils.js')
const { hash } = require('../../utils.js')
const auth_token = require('../../passport/token')
const auth_google = require('../../passport/google')
const auth_facebook = require('../../passport/facebook')
const axios = require('axios')

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * /api/login/google:
   *   post:
   *     tags: [Authentication]
   *     summary: Login with Google
   *     description: This endpoint allows users to login with Google.
   *     requestBody:
   *       description: User data required for Google authentication
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 description: Google ID token
   *                 example: "googleidtoken"
   *               displayName:
   *                 type: string
   *                 description: User's display name on Google
   *                 example: "John Doe"
   *               email:
   *                 type: string
   *                 description: User's email on Google
   *                 example: "johndoe@gmail.com"
   *     responses:
   *       '201':
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                   description: Status of the response
   *                 data:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   */
  app.post('/api/login/google', async (req, res, next) => {
    try {
      let user = await database.prisma.user.findUnique({
        where: { googleId: req.body.id }
      })
      if (user) {
        const token = utils.generateToken(user.id)
        return res.status(201).json({
          status: 'success',
          data: { user, token },
          statusCode: res.statusCode
        })
      }
      const oldUser = await database.prisma.user.findUnique({
        where: { email: req.body.email }
      })
      if (oldUser) {
        user = await database.prisma.user.update({
          where: { email: req.body.email },
          data: { googleId: req.body.id }
        })
        const token = utils.generateToken(user.id)
        return res.status(201).json({
          status: 'success',
          data: { user, token },
          statusCode: res.statusCode
        })
      }
      user = await database.prisma.user.create({
        data: {
          username: req.body.displayName,
          email: req.body.email,
          googleId: req.body.id,
          password: await hash(req.body.id),
          isAdmin: false,
          mailVerification: true
        }
      })
      const token = utils.generateToken(user.id)
      return res.status(201).json({
        status: 'success',
        data: { user, token },
        statusCode: res.statusCode
      })
    } catch (err) {
      console.error(err.message)
      return res.status(401).send('Google auth failed.')
    }
  })

  /**
   * @swagger
   * /api/login/facebook:
   *   get:
   *     tags: [Authentication]
   *     summary: Authenticate with Facebook
   *     description: Endpoint to initiate authentication with Facebook.
   *     security: []
   *     responses:
   *       302:
   *         description: Redirects to Facebook login page.
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   *       500:
   *         description: Server error.
   */
  app.get(
    '/api/login/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
  )

  /**
   * @swagger
   *
   * /api/login/facebookCallBack:
   *   get:
   *     tags: [Authentication]
   *     description: Authenticate a user with Facebook and return a JWT token.
   *     responses:
   *       '201':
   *         description: User authenticated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 data:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Welcome back."
   *                     user:
   *                       type: object
   *                     token:
   *                       type: string
   *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *                 statusCode:
   *                   type: number
   *                   example: 201
   *       '401':
   *         description: Invalid Facebook authentication.
   */
  app.get(
    '/api/login/facebookCallBack',
    passport.authenticate('facebook', { session: false }),
    (req, res) => {
      const user = req.user
      const token = utils.generateToken(user.id)
      return res.status(201).json({
        status: 'success',
        data: {
          message: 'Welcome back.',
          user,
          token
        },
        statusCode: res.statusCode
      })
    }
  )

  /**
   * @swagger
   * /api/token:
   *   post:
   *     tags: [Authentication]
   *     summary: Updates user's tokens.
   *     description: Update user's Google, Discord, and Deezer tokens.
   *     security:
   *       - jwt: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               google:
   *                 type: string
   *                 description: User's Google token.
   *               discord:
   *                 type: string
   *                 description: User's Discord token.
   *               deezer:
   *                 type: string
   *                 description: User's Deezer token.
   *             example:
   *               google: "google_token_string"
   *               discord: "discord_token_string"
   *               deezer: "deezer_token_string"
   *     responses:
   *       200:
   *         description: Token updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: Response status.
   *                   example: "success"
   *                 data:
   *                   type: object
   *                   description: Response data.
   *                   properties:
   *                     message:
   *                       type: string
   *                       description: Response message.
   *                       example: "Token updated."
   *                     user:
   *                       type: object
   *                       description: User object with updated token information.
   *                       properties:
   *                         id:
   *                           type: integer
   *                           description: User ID.
   *                           example: 1
   *                         googleToken:
   *                           type: string
   *                           description: User's Google token.
   *                           example: "google_token_string"
   *                         discordToken:
   *                           type: string
   *                           description: User's Discord token.
   *                           example: "discord_token_string"
   *                         deezerToken:
   *                           type: string
   *                           description: User's Deezer token.
   *                           example: "deezer_token_string"
   *                     token:
   *                       type: string
   *                       description: New JWT token.
   *                       example: "jwt_token_string"
   *                 statusCode:
   *                   type: integer
   *                   description: Response status code.
   *                   example: 200
   *       400:
   *         description: An error occurred while updating token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message.
   *                   example: "Token manager temporarily deactivated."
   */
  app.post(
    '/api/token',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      if (!req.user) return res.status(401).send('Invalid token')
      try {
        const user = await database.prisma.User.update({
          where: { id: req.user.id },
          data: {
            googleToken: req.body.google != '' ? req.body.google : null,
            discordToken: req.body.discord != '' ? req.body.discord : null,
            redditToken: req.body.reddit != '' ? req.body.reddit : null,
            deezerToken: req.body.deezer != '' ? req.body.deezer : null
          }
        })
        const token = utils.generateToken(user.id)
        return res.status(200).json({
          status: 'success',
          data: { message: 'Token updated.', user, token },
          statusCode: res.statusCode
        })
      } catch (err) {
        console.log(err)
        return res.status(400).send('Token manager temporarily desactivated.')
      }
    }
  )

  /**
   * @swagger
   * /api/code/deezer:
   *   post:
   *     tags: [Authentication]
   *     summary: Create or update auth token for Deezer service
   *     description: Create or update an authentication token for the
   *       Deezer service by providing an app ID, secret, and authorization code.
   *     security:
   *       - jwt: []
   *     requestBody:
   *       description: JSON object containing the app ID, secret, and authorization code.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               app_id:
   *                 type: string
   *               secret:
   *                 type: string
   *               code:
   *                 type: string
   *     responses:
   *       200:
   *         description: Auth token created/updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: Status of the response.
   *                   example: "success"
   *                 data:
   *                   type: object
   *                   description: Contains the access token for Deezer.
   *                   properties:
   *                     access_token:
   *                       type: string
   *                       description: Access token for Deezer.
   *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
   *                 statusCode:
   *                   type: integer
   *                   description: HTTP status code of the response.
   *                   example: 200
   *       400:
   *         description: Code generation has failed.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message.
   *                   example: "Code generation has failed."
   */
  app.post(
    '/api/code/deezer',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      if (!req.user) return res.status(401).send('Invalid code')
      try {
        const ret = await axios.post(
          'https://connect.deezer.com/oauth/access_token.php?app_id=' +
            req.body.app_id +
            '&secret=' +
            req.body.secret +
            '&code=' +
            req.body.code +
            '&output=json'
        )
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
