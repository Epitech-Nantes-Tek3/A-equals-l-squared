'use strict'

const client = require('../init').client
const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

/**
 * Send a message to a channel from an area
 * @param {*} Area Area that contains the parameters
 * @param {*} dynamicParameters Dynamic parameters that will be used to replace the parameters
 * @returns True if the message has been sent, false otherwise
 */
function discordSendMessageChannelFromArea (Area, dynamicParameters) {
  const reactionParameters = Area.ReactionParameters
  let messageContent = reactionParameters.find(
    parameter => parameter.Parameter.name == 'messageContent'
  ).value
  messageContent = replaceDynamicParameters(messageContent, dynamicParameters)

  let channelId = reactionParameters.find(
    parameter => parameter.Parameter.name == 'channelId'
  ).value
  channelId = replaceDynamicParameters(channelId, dynamicParameters)

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
