'use strict'

const client = require('../init').client

/**
 * Send a message to a channel from an area
 * @param {*} Area Area that contains the parameters
 * @returns True if the message has been sent, false otherwise
 */
function discordSendMessageChannelFromArea (Area) {
  const reactionParameters = Area.ReactionParameters
  const messageContent = replaceDynamicParameters(reactionParameters.find(
    parameter => parameter.Parameter.name == 'messageContent'
  ).value)
  const channelId = replaceDynamicParameters(reactionParameters.find(
    parameter => parameter.Parameter.name == 'channelId'
  ).value)
  return sendMessageChannel(channelId, messageContent)
}

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
      return true
    })
    .catch(err => {
      console.error(err.message)
      return false
    })
}

module.exports = { discordSendMessageChannelFromArea, sendMessageChannel }
