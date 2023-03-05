'use strict'

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * components:
   *   securitySchemes:
   *     bearerAuth:
   *       type: http
   *       scheme: bearer
   *       bearerFormat: JWT
   *   schemas:
   *     NewsLetter:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           description: The ID of the newsLetter
   *         title:
   *           type: string
   *           description: The title of the newsLetter
   *         content:
   *           type: string
   *           description: The content of the newsLetter
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The date and time when the newsLetter was created
   *         createdBy:
   *           type: string
   *           description: The author name of the newsLetter
   *   responses:
   *     BadRequest:
   *       description: The request was invalid or could not be served
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               error:
   *                 type: string
   *                 description: A message describing the error
   *     Unauthorized:
   *       description: Authentication failed or user does not have permissions for the requested operation
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               error:
   *                 type: string
   *                 description: A message describing the error
   *     NotFound:
   *       description: The requested resource was not found
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               error:
   *                 type: string
   *                 description: A message describing the error
   *     InternalServerError:
   *       description: An error occurred while processing the request
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               error:
   *                 type: string
   *                 description: A message describing the error
   */

  /**
   * @swagger
   * /api/newsLetter:
   *   get:
   *     tags: [NewsLetter]
   *     summary: Get all newsLetter
   *     description: Retrieve a list of all newsLetter for the authenticated user
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         description: A list of newsLetter
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                    id:
   *                        type: integer
   *                        description: The ID of the newsLetter
   *                    title:
   *                        type: string
   *                        description: The title of the newsLetter
   *                    content:
   *                        type: string
   *                        description: The content of the newsLetter
   *                    createdAt:
   *                        type: string
   *                        format: date-time
   *                        description: The date and time when the newsLetter was created
   *                    createdBy:
   *                        type: string
   *                        description: The author name of the newsLetter
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  app.get(
    '/api/newsLetter',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        const newsLetter = await database.prisma.NewsLetter.findMany({})
        return res.status(200).json(newsLetter)
      } catch (err) {
        console.debug(err)
        res.status(500).json({ error: err.message })
      }
    }
  )

  /**
   * @swagger
   * /api/newsLetter:
   *   post:
   *     tags: [NewsLetter]
   *     summary: Get all newsLetter
   *     description: Retrieve a list of all newsLetter for the authenticated user
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         description: The created newsLetter
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                    id:
   *                        type: integer
   *                        description: The ID of the newsLetter
   *                    title:
   *                        type: string
   *                        description: The title of the newsLetter
   *                    content:
   *                        type: string
   *                        description: The content of the newsLetter
   *                    createdAt:
   *                        type: string
   *                        format: date-time
   *                        description: The date and time when the newsLetter was created
   *                    createdBy:
   *                        type: string
   *                        description: The author name of the newsLetter
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  app.post(
    '/api/newsLetter',
    passport.authenticate('jwt-admin', { session: false }),
    async (req, res) => {
      try {
        const newsLetter = await database.prisma.NewsLetter.create({
          data: {
            title: req.body.title,
            content: req.body.content,
            createdBy: req.user.name
          }
        })
        return res.status(200).json(newsLetter)
      } catch (err) {
        console.debug(err)
        res.status(500).json({ error: err.message })
      }
    }
  )
}
