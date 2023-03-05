'use strict'

const discordClient = require('../../services/discord/init')
const getVoiceChannels = require('../../services/discord/getters/voice_channels')
const getTextChannels = require('../../services/discord/getters/text_channels')
const getAvailableGuilds = require('../../services/discord/getters/available_guilds')

module.exports = function (app, passport, database) {
  /**
   * @swagger
   * /api/services/discord/getAvailablePerformers:
   *   get:
   *     tags: [Services/Discord]
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
   *                         example: "Bot Name"
   *                 statusCode:
   *                   type: number
   *                   example: 200
   *       400:
   *         description: No Discord account linked or an error occurred.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "No Discord account linked."
   *                 statusCode:
   *                   type: number
   *                   example: 400
   */
  app.get(
    '/api/services/discord/getAvailablePerformers',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const performers = []
      if (discordClient.presence.status == 'online')
        performers.push({
          id: discordClient.client.user.id,
          name: discordClient.client.user.username
        })
      if (req.user.discordToken != null)
        performers.push({
          id: req.user.discordToken,
          name: req.user.username
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
   * /api/services/discord/getVoiceChannels:
   *   get:
   *     tags: [Services/Discord]
   *     summary: List all available Voice Channels on a given Guild ID.
   *     security:
   *       - jwt: []
   *     parameters:
   *       - in: query
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the Discord guild.
   *     responses:
   *       '200':
   *         description: Successful response with the list of voice channels.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The status of the response.
   *                   example: success
   *                 data:
   *                   type: array
   *                   description: An array of voice channel objects.
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: The ID of the voice channel.
   *                       name:
   *                         type: string
   *                         description: The name of the voice channel.
   *                       type:
   *                         type: string
   *                         description: The type of the voice channel.
   *                         enum: [voice]
   *                       createdAt:
   *                         type: string
   *                         description: The date and time when the voice channel was created.
   *                 statusCode:
   *                   type: number
   *                   description: The status code of the response.
   *                   example: 200
   */
  app.get(
    '/api/services/discord/getVoiceChannels',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const channels = getVoiceChannels(req.query.id)
      return res.status(200).json({
        status: 'success',
        data: channels,
        statusCode: res.statusCode
      })
    }
  )

  /**
   * @swagger
   * /api/services/discord/getTextChannels:
   *   get:
   *     tags: [Services/Discord]
   *     summary: List all available Text Channels on a given GuildID.
   *     security:
   *       - jwt: []
   *     parameters:
   *       - in: query
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the guild to retrieve channels from.
   *     responses:
   *       200:
   *         description: A list of available text channels.
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
   *                         description: The unique ID of the text channel.
   *                       name:
   *                         type: string
   *                         description: The name of the text channel.
   *                       position:
   *                         type: integer
   *                         description: The position of the text channel in the guild's channel list.
   *                       parentId:
   *                         type: string
   *                         description: The ID of the parent category for the text channel, if applicable.
   *                 statusCode:
   *                   type: integer
   *                   example: 200
   *       400:
   *         description: Service getter temporarily disabled.
   *       401:
   *         description: Invalid token.
   *       404:
   *         description: Guild not found.
   */
  app.get(
    '/api/services/discord/getTextChannels',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const channels = getTextChannels(req.query.id)
      return res.status(200).json({
        status: 'success',
        data: channels,
        statusCode: res.statusCode
      })
    }
  )

  /**
   * @swagger
   * /api/services/discord/getAvailableGuilds:
   *   get:
   *     tags: [Services/Discord]
   *     summary: List all available Guilds where the bot is.
   *     security:
   *       - jwt: []
   *     responses:
   *       200:
   *         description: Returns a list of available guilds.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The status of the response.
   *                   example: success
   *                 data:
   *                   type: array
   *                   description: An array of guilds.
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: The unique identifier for the guild.
   *                         example: '1234567890'
   *                       name:
   *                         type: string
   *                         description: The name of the guild.
   *                         example: 'My Discord Server'
   *                 statusCode:
   *                   type: number
   *                   description: The status code of the response.
   *                   example: 200
   *       400:
   *         description: An error occurred.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: The error message.
   *                   example: No Discord account linked.
   *                 statusCode:
   *                   type: number
   *                   description: The status code of the response.
   *                   example: 400
   */
  app.get(
    '/api/services/discord/getAvailableGuilds',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      if (req.user.discordToken == null)
        return res.status(400).send('No Discord account linked.')
      try {
        const guilds = await getAvailableGuilds(req.user.discordToken)
        if (guilds == null) return res.status(400).send('An error occured.')
        return res.status(200).json({
          status: 'success',
          data: guilds,
          statusCode: res.statusCode
        })
      } catch (err) {
        console.log(err)
        return res.status(400).send('An error occured.')
      }
    }
  )
}
