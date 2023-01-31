'use strict'

const client = require('../init').client

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
