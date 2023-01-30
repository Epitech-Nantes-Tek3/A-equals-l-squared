'use strict'

const client = require('../init')

/**
 * @brief Triggered when a message is sent on a Discord server. 'message.content'
 * is filled only if the bot is mentioned in the message.
 * @param {*} message Message object
 */
client.on('message', message => {
  if (message.author.bot) return
  message.content = message.content.replace(
    '<@' + client.user.id.toString() + '> ',
    ''
  )
})
