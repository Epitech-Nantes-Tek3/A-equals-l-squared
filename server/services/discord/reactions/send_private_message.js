'use strict'

const client = require('../init').client
const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

/**
 * @brief Send a private message to a user from an area
 * @param {*} Area Area that contains the parameters
 * @returns True if the message has been sent, false otherwise
 */
function discordSendPrivateMessageFromArea (Area, dynamicParameters) {
  const reactionParameters = Area.ReactionParameters
  let messageContent = reactionParameters.find(
    parameter => parameter.Parameter.name == 'messageContent'
  ).value
  messageContent = replaceDynamicParameters(messageContent, dynamicParameters)

  let userId = reactionParameters.find(
    parameter => parameter.Parameter.name == 'UserId'
  ).value
  userId = replaceDynamicParameters(userId, dynamicParameters)

  return sendPrivateMessage(userId, messageContent)
}

/**
 * @brief Send a private message to a user
 * @param {*} userID ID of the user you want to send the message
 * @param {*} message Message that you want to send
 * @returns True if the message has been sent, false otherwise
 */
function sendPrivateMessage (userID, message) {
  client.users
    .fetch(userID)
    .then(user => {
      user.send(message)
      console.log('Private message sent successfully')
      return true
    })
    .catch(err => {
      console.error(err.message)
      return false
    })
}

module.exports = { discordSendPrivateMessageFromArea, sendPrivateMessage }
