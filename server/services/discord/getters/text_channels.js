'use strict'

const client = require('../init').client

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
