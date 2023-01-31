'use strict'

const client = require('../init').client

/**
 * @brief Triggered when a user joins a Discord voice channel.
 * @param {*} oldChannel Previous channel object
 * @param {*} newChannel Current channel object
 */
client.on('voiceStateUpdate', (oldChannel, newChannel) => {
  var oldUserChannel = oldChannel.channelID
  var newUserChannel = newChannel.channelID
  if (!newUserChannel) {
    //  Leaving a voice channel
    console.log('User left the channel')
    return
  }

  if (newUserChannel === 'ID of the channel wanted')
    //  If it's the channel that you want
    console.log('Joined the channel wanted')
  else console.log('Joined another channel than the one wanted') //  If it's another channel that the one wanted
})
