'use strict'

const client = require('../init').client
const { AreaGlue } = require('../../glue/glue.js')

/**
 * @brief Triggered when a user joins a Discord voice channel.
 * @param {*} oldChannel Previous channel object
 * @param {*} newChannel Current channel object
 */
client.on('voiceStateUpdate', (oldChannel, newChannel) => {
  try {
    const parametersList = [
      { name: 'channelId', value: newChannel.channelID, valid: false },
      {
        name: 'guildId',
        value: newChannel.guild.id,
        valid: false
      }
    ]

    const dynamicParameters = []

    AreaGlue('DSC-02', parametersList, dynamicParameters)
  } catch (error) {
    console.error(error)
  }
})
