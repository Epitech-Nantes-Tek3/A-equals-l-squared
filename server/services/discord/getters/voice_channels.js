'use strict'

const client = require('../init').client

/**
 * @brief Get all voice channels of a guild by its ID.
 * @param {*} guildID ID of the guild you want to get voice channels.
 * @returns An array of voice channels with their ID and name.
 */

function getVoiceChannels (guildID) {
  var voice_channels = []
  var voice_channel = {}
  client.guilds.cache.get(guildID).channels.cache.filter(channel => {
    if (channel.type === 'voice') {
      voice_channel = {
        id: channel.id,
        name: channel.name
      }
      voice_channels.push(voice_channel)
    }
  })
  return voice_channels
}

module.exports = getVoiceChannels
