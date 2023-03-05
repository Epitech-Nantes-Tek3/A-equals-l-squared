'use strict'

const client = require('../init').client
const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

/**
 * @brief Send a private message to a user from an area
 * @param {*} ReactionParameters The parameters
 * @param {*} dynamicParameters Dynamic parameters that will be replaced in the message
 * @param {*} User the user
 * @returns True if the message has been sent, false otherwise
 */
function discordSendPrivateMessageFromAreaParameters (
  ReactionParameters,
  dynamicParameters,
  User
) {
  let messageContent = ReactionParameters.find(
    parameter => parameter.Parameter.name == 'messageContent'
  ).value
  messageContent = replaceDynamicParameters(messageContent, dynamicParameters)

  let userId = ReactionParameters.find(
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
  if (client.users.cache.has(userID)) {
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
  } else {
    console.log('User not found')
    return false
  }
}

module.exports = {
  discordSendPrivateMessageFromAreaParameters,
  sendPrivateMessage
}
