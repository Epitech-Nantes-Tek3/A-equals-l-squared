'use strict'

const client = require('../init').client
const { AreaGlue } = require('../../glue/glue.js')

/**
 * @brief Triggered when a message is sent on a Discord server. 'message.content'
 * is filled only if the bot is mentioned in the message.
 * @param {*} message Message object
 */
client.on('message', message => {
  if (message.author.bot) return
  try {
    message.content = message.content.replace(
      '<@' + client.user.id.toString() + '> ',
      ''
    )
    AreaGlue('D-01', ['null'])
  } catch (error) {
    console.error(error)
  }
})
