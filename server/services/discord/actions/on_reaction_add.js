'use strict'

const client = require('../init').client
const { getActionFromCode, AreaGlue, checkActionParameters } = require('../../glue/glue.js')


/**
 * @brief Triggered when a user reacts to a message.
 * @param {*} reaction Reaction object
 * @param {*} user User that reacted to the message
 */
client.on('messageReactionAdd', (reaction, user) => {
  try {
    const parametersList = [
      { name: 'channelId',
        value: reaction.message.channel.id,
        valid: false },
      {
        name: 'guildId',
        value: reaction.message.channel.guild.id,
        valid: false
      }
    ]

    AreaGlue('DSC-04', parametersList)
  } catch (error) {
    console.error(error)
  }
})
