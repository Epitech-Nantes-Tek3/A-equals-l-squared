'use strict'

const client = require('../init').client

/**
 * @brief Change the activity of the bot from an area
 * @param {*} Area Area that contains the parameters
 * @returns True if the message has been sent, false otherwise
 */
function discordchangeActivityFromArea (Area) {
  const reactionParameters = Area.ReactionParameters
  const activity = reactionParameters.find(
    parameter => parameter.Parameter.name == 'activity'
  ).value
  return changeActivity(activity)
}

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

module.exports = {discordchangeActivityFromArea, changeActivity }
