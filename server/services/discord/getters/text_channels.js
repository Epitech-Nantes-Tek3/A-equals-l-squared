'use strict'

const client = require('../init').client

/**
 * @brief Get all text channels of a guild by its ID.
 * @param {*} guildID ID of the guild you want to get text channels.
 * @returns An array of text channels with their ID and name.
 */
function getTextChannels (guildID) {
  var text_channels = []
  var text_channel = {}
  client.guilds.cache.get(guildID).channels.cache.filter(channel => {
    if (channel.type === 'text') {
      text_channel = {
        id: channel.id,
        name: channel.name
      }
      text_channels.push(text_channel)
    }
  })
  return text_channels
}

module.exports = getTextChannels
