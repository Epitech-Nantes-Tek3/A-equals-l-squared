'use strict'

const client = require('../init')

/**
 * @brief Send a message to a channel
 * @param {*} channelID ID of the channel you want to send the message
 * @param {*} message Message that you want to send
 * @returns True if the message has been sent, false otherwise
 */
function sendMessageChannel (channelID, message) {
  client.channels
    .fetch(channelID)
    .then(channel => {
      channel.send(message)
      console.log('Message in channel sent successfully')
      return true
    })
    .catch(err => {
      console.error(err.message)
      return false
    })
}

module.exports = sendMessageChannel
