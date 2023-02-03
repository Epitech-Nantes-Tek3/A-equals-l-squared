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
    console.log('A new user just joined the Discord server: ' + user.tag)
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
    AreaGlue('D-02', ['null'])
  } catch (error) {
    console.error(error)
  }
})
