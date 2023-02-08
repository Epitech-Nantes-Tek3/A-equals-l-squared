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
    const parametersList = [
      { name: 'channelId',
        value: message.channel.id,
        valid: false },
      {
        name: 'guildId',
        value: message.channel.guild.id,
        valid: false
      }
    ]
    AreaGlue('DSC-01', parametersList)
  } catch (error) {
    console.error(error)
  }
})
