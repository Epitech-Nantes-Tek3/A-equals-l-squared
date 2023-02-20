'use strict'

const client = require('../init').client
const {
  getActionFromCode,
  AreaGlue,
  checkActionParameters
} = require('../../glue/glue.js')

/**
 * @brief Triggered when a user reacts to a message.
 * @param {*} reaction Reaction object
 * @param {*} user User that reacted to the message
 */
client.on('messageReactionAdd', (reaction, user) => {
  try {
    const parametersList = [
      { name: 'channelId', value: reaction.message.channel.id, valid: false },
      {
        name: 'guildId',
        value: reaction.message.channel.guild.id,
        valid: false
      }
    ]

    const dynamicParameters = [
      { name: 'REACTION', value: reaction.emoji.name },
      { name: 'MESSAGE_ID', value: reaction.message.id },
      { name: 'USER_ID', value: user.id },
      { name: 'USER_NAME', value: user.username },
      { name: 'CHANNEL_ID', value: reaction.message.channel.id },
      { name: 'CHANNEL_NAME', value: reaction.message.channel.name },
      { name: 'GUILD_ID', value: reaction.message.channel.guild.id },
      { name: 'GUILD_NAME', value: reaction.message.channel.guild.name }
    ]

    AreaGlue('DSC-04', parametersList, dynamicParameters)
  } catch (error) {
    console.error(error)
  }
})
