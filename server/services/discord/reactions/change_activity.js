'use strict'

const client = require('../connect')

/**
 * @brief Change the activity of the bot
 * @param {*} string The new activity
 * @returns True if the activity has been changed, false otherwise
 */
function changeActivity (string) {
  client.user
    .setActivity(string)
    .then(() => {
      console.log("Activity set to '" + string + "'")
      return true
    })
    .catch(err => {
      return false
    })
}

module.exports = changeActivity
