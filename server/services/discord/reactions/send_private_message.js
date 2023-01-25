'use strict'

const client = require('../connect')

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

module.exports = sendPrivateMessage
