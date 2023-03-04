'use strict'

const axios = require('axios')
const getUserPlaylists = require('../../services/deezer/getters/user_playlists')

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * /api/services/deezer/getUserPlaylists:
   *   get:
   *     tags: [Services/Deezer]
   *     summary: List all user's playlist on Deezer
   *     description: List all user's playlist on Deezer, requires authentication.
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         description: User's playlists listed successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: number
   *                       title:
   *                         type: string
   *                       picture:
   *                         type: string
   *                       description:
   *                         type: string
   *                       nb_tracks:
   *                         type: number
   *                       is_public:
   *                         type: boolean
   *                 statusCode:
   *                   type: number
   *                   example: 200
   *       400:
   *         description: Deezer account not linked or error occurred.
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   */
  app.get(
    '/api/services/deezer/getUserPlaylists',
    passport.authenticate('jwt', { sessions: false }),
    async (req, res) => {
      if (req.user.deezerToken == null)
        return res.status(400).send('No Deezer account linked.')
      try {
        const playlists = await getUserPlaylists(
          req.user.deezerId,
          req.user.deezerToken
        )
        if (playlists == null) return res.status(400).send('No playlist found.')
        return res.status(200).json({
          status: 'success',
          data: playlists,
          statusCode: res.statusCode
        })
      } catch (err) {
        console.log(err)
        return res.status(400).send('An error occured.')
      }
    }
  )

  /**
   * @swagger
   * /api/services/deezer/fillUserId:
   *   get:
   *     tags: [Services/Deezer]
   *     summary: Add in database the user id
   *     description: Add in database the user id from a token
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         description: Deezer ID successfully updated.
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *       400:
   *         description: Deezer account not linked or error occurred.
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   */
  app.post(
    '/api/services/deezer/fillUserId',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      if (req.user.deezerToken == null)
        return res.status(400).send('No Deezer account linked.')
      try {
        const response = await axios.get(
          'https://api.deezer.com/user/me?access_token=' + req.user.deezerToken,
          {
            headers: {
              Authorization: `Bearer ${req.user.deezerToken}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
        const user = await database.prisma.User.update({
          where: { id: req.user.id },
          data: { deezerId: response.data.id.toString() }
        })
        return res.status(200).send('Deezer ID successfully updated.')
      } catch (err) {
        console.log(err)
        return res.status(400).send('An error occured.')
      }
    }
  )
}
