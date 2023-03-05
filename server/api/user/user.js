'use strict'

const gmail = require('../../services/gmail/reactions/send_email')
const auth_token = require('../../passport/local')
const utils = require('../../utils')
const axios = require('axios')
const database = require('../../database_init')
const jwt = require('jwt-simple')

/**
 * Refresh the Reddit token of the user
 * @param {*} userId The ID of the user in the database
 * @param {*} refresh_token The refresh token of the user
 */
async function refresh_reddit_token (userId, refresh_token) {
  try {
    const postData = {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }
    const authString = `7P3NMqftCBgr7H-XaPUbNg:gPFD-f_P2DNz8WVjm-Qwj21G8hS9KA`
    const authHeader = `Basic ${Buffer.from(authString).toString('base64')}`

    const response = await axios.post(
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
    const user = await database.prisma.User.update({
      where: { id: userId },
      data: {
        redditToken: response.data.access_token,
        redditRefreshToken: response.data.refresh_token
      }
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * /api/signup:
   *  post:
   *    tags: [User]
   *    description: Sign up a new user in the database
   *    consumes:
   *      - application/json
   *    parameters:
   *      - in: body
   *        name: user
   *        description: The user to create.
   *        required: true
   *        schema:
   *          type: object
   *          properties:
   *            email:
   *              type: string
   *            password:
   *              type: string
   *    responses:
   *      201:
   *        description: User created
   *      400:
   *        description: Bad request
   */
  app.post('/api/signup', (req, res, next) => {
    passport.authenticate('signup', { session: false }, (err, user, info) => {
      if (err) throw new Error(err)
      if (user == false) return res.json(info)
      const token = utils.generateToken(user.id)
      gmail
        .sendEmail(
          'aequallsquared@gmail.com',
          user.email,
          'Email Verification',
          'Thank you for you registration to our service !\nPlease go to the following link to confirm your mail : http://localhost:8080/api/mail/verification?token=' +
            token
        )
        .catch(_error => {
          return
        })
      return res
        .status(201)
        .json({ status: 'success', statusCode: res.statusCode })
    })(req, res, next)
  })

  /**
   * @swagger
   * /api/login:
   *   post:
   *     tags: [User]
   *     description: Login an existing user with username and password
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: body
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             username:
   *               type: string
   *             password:
   *               type: string
   *           example:
   *             username: testuser
   *             password: testpassword
   *     responses:
   *       201:
   *         description: Successfully logged in
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *               enum: [success]
   *             data:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Welcome back.
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     username:
   *                       type: string
   *                       example: testuser
   *                     email:
   *                       type: string
   *                       example: testuser@example.com
   *                     mailVerification:
   *                       type: boolean
   *                       example: true
   *                 token:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
   *       400:
   *         description: Bad request
   */
  app.post('/api/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
      if (err) throw new Error(err)
      if (user == false) return res.json(info)
      if (user.redditToken != null)
        refresh_reddit_token(user.id, user.redditRefreshToken)
      const token = utils.generateToken(user.id)
      return res.status(201).json({
        status: 'success',
        data: { message: 'Welcome back.', user, token },
        statusCode: res.statusCode
      })
    })(req, res, next)
  })

  /**
   * @swagger
   * /api/mail/verification:
   *   get:
   *     tags: [User]
   *     description: Verify user email from email link
   *     produces:
   *       - text/plain
   *     parameters:
   *       - name: token
   *         in: query
   *         required: true
   *         type: string
   *         description: JWT token received in email link
   *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   *     responses:
   *       200:
   *         description: Email verified
   *         type: string
   *       401:
   *         description: No matching user found
   */
  app.get('/api/mail/verification', async (req, res) => {
    const token = req.query.token
    try {
      const decoded = jwt.decode(token, process.env.JWT_SECRET)
      const user = await database.prisma.User.findUnique({
        where: { id: decoded.id }
      })
      await database.prisma.User.update({
        where: { id: decoded.id },
        data: { mailVerification: true }
      })
      res.send(
        'Email now successfully verified !\nYou can go back to login page.'
      )
    } catch (err) {
      console.error(err.message)
      res.status(401).send('No matching user found.')
    }
  })

  /**
   * @swagger
   * /api/mail/customVerification:
   *   get:
   *     tags: [User]
   *     description: Execute custom verification operation based on user's `confirmProcess` value
   *     produces:
   *       - text/plain
   *     parameters:
   *       - name: token
   *         in: query
   *         required: true
   *         type: string
   *         description: JWT token received in email link
   *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   *     responses:
   *       200:
   *         description: Operation authorized and executed
   *         type: string
   *       401:
   *         description: No matching user found
   */
  app.get('/api/mail/customVerification', async (req, res) => {
    const token = req.query.token
    try {
      const decoded = jwt.decode(token, process.env.JWT_SECRET)
      const user = await database.prisma.User.findUnique({
        where: { id: decoded.id }
      })
      const processType = user.confirmProcess
      await database.prisma.User.update({
        where: { id: decoded.id },
        data: { confirmProcess: '' }
      })
      if (processType == 'Delete') {
        await database.prisma.User.delete({ where: { id: decoded.id } })
      }
      if (processType == 'ResetPassword') {
        await database.prisma.User.update({
          where: { id: decoded.id },
          data: { password: await utils.hash('password') }
        })
      }
      res.send('Operation ' + processType + ' authorized and executed.')
    } catch (err) {
      console.error(err.message)
      res.status(401).send('No matching user found.')
    }
  })

  /**
   * @swagger
   * /api/user/deleteAccount:
   *   get:
   *     tags: [User]
   *     summary: Delete user account
   *     description: Deletes the user account with the authenticated user's ID after sending a confirmation email to the user's email address.
   *     security:
   *       - jwt: []
   *     responses:
   *       '200':
   *         description: A success message indicating that the confirmation email has been sent.
   *       '401':
   *         description: Unauthorized access, when the authentication token is invalid or missing.
   *       '500':
   *         description: Internal server error, when the database query or email sending fails.
   */
  app.get(
    '/api/user/deleteAccount',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      if (!req.user) return res.status(401).send('Invalid token')
      await database.prisma.User.update({
        where: { id: req.user.id },
        data: { confirmProcess: 'Delete' }
      })
      const token = utils.generateToken(req.user.id)
      gmail
        .sendEmail(
          'aequallsquared@gmail.com',
          req.user.email,
          'Confirm operation',
          'You asked to delete your account. Please confirm this operation by visiting this link : http://localhost:8080/api/mail/customVerification?token=' +
            token
        )
        .catch(_error => {
          return
        })
      return res.json('Verification e-mail sended')
    }
  )

  /**
   * @swagger
   * /api/user/resetPassword:
   *   post:
   *     summary: Request to reset user password
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: User's email address
   *                 example: example@example.com
   *     responses:
   *       200:
   *         description: Verification e-mail sent
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Success message
   *                   example: Verification e-mail sent.
   *       400:
   *         description: No user found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message
   *                   example: No user found.
   *       401:
   *         description: Please verify your e-mail address
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message
   *                   example: Please verify your e-mail address.
   */
  app.post('/api/user/resetPassword', async (req, res, next) => {
    const user = await database.prisma.User.findFirst({
      where: { email: req.body.email }
    })
    if (!user) return res.status(400).json('No user found.')
    if (!user.mailVerification)
      return res.status(401).json('Please verify your e-mail address.')
    await database.prisma.User.update({
      where: { id: user.id },
      data: { confirmProcess: 'ResetPassword' }
    })
    const token = utils.generateToken(user.id)
    gmail
      .sendEmail(
        'aequallsquared@gmail.com',
        user.email,
        'Confirm operation',
        'You asked to regenerate your password. It will be set to : password\nPlease confirm this operation by visiting this link : http://localhost:8080/api/mail/customVerification?token=' +
          token
      )
      .catch(_error => {
        return
      })
    return res.json('Verification e-mail sent.')
  })

  /**
   * @swagger
   * /api/user/updateData:
   *   post:
   *     tags: [User]
   *     summary: Updates the authenticated user's username, email, and password
   *     security:
   *       - jwt: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             example:
   *               username: johndoe123
   *               email: johndoe@example.com
   *               password: newpassword
   *     responses:
   *       200:
   *         description: Success message
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *               example:
   *                 message: "Your informations have been successfully updated."
   *       400:
   *         description: Incomplete request body
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *               example:
   *                 message: "Please pass a complete body."
   *       401:
   *         description: Invalid token or email not verified
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *               example:
   *                 message: "Please verify your e-mail address."
   */
  app.post(
    '/api/user/updateData',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      if (!req.user) return res.status(401).send('Invalid token')
      try {
        if (req.user.email != req.body.email) {
          const token = utils.generateToken(req.user.id)
          gmail
            .sendEmail(
              'aequallsquared@gmail.com',
              req.body.email,
              'Email Verification',
              'You have updated your e-mail, please go to the following link to confirm your new mail address : http://localhost:8080/api/mail/verification?token=' +
                token
            )
            .catch(_error => {
              return
            })
          await database.prisma.User.update({
            where: { id: req.user.id },
            data: { mailVerification: false }
          })
        }
        await database.prisma.User.update({
          where: { id: req.user.id },
          data: {
            username: req.body.username,
            email: req.body.email,
            password: await utils.hash(req.body.password)
          }
        })
        return res.json('Your informations have been successfully updated.')
      } catch (err) {
        console.error(err)
        return res.status(400).json('Please pass a complete body.')
      }
    }
  )
}
