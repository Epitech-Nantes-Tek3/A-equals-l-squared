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
      { name: 'channelId', value: message.channel.id, valid: false },
      {
        name: 'guildId',
        value: message.channel.guild.id,
        valid: false
      }
    ]

    const dynamicParameters = [
      { name: 'MESSAGE_ID', value: message.id },
      { name: 'MESSAGE_CONTENT', value: message.content },
      { name: 'USER_NAME', value: message.author.username },
      { name: 'USER_ID', value: message.author.id },
      { name: 'CHANNEL_ID', value: message.channel.id },
      { name: 'CHANNEL_NAME', value: message.channel.name },
      { name: 'GUILD_ID', value: message.channel.guild.id },
      { name: 'GUILD_NAME', value: message.channel.guild.name }
    ]

    AreaGlue('DSC-01', parametersList, dynamicParameters)
  } catch (error) {
    console.error(error)
  }
})
