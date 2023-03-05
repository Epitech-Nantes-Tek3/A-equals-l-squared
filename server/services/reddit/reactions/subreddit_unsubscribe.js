'use strict'

const axios = require('axios')
const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

/**
 * @brief Unsubscribe to a subreddit from an area
 * @param {*} ReactionParameters Reaction parameters
 * @param {*} dynamicParameters Dynamic parameters
 * @param {*} User User that contains the token
 * @returns True if it was successful, false otherwise
 */
function redditUnsubscribeToSubredditFromAreaParameters (
  ReactionParameters,
  dynamicParameters,
  User
) {
  let subredditName = ReactionParameters.find(
    parameter => parameter.Parameter.name == 'subredditName'
  ).value
  subredditName = replaceDynamicParameters(subredditName, dynamicParameters)
  return unsubscribeToSubreddit(User.redditToken, subredditName)
}

/**
 * @brief Unsubscribe to a subreddit
 * @param {*} token Reddit token of the user
 * @param {*} subredditName Name of the subreddit
 * @returns True if it was successful, false otherwise
 */
async function unsubscribeToSubreddit (token, subredditName) {
  try {
    const response = await axios.post(
      `https://oauth.reddit.com/api/subscribe`,
      {
        action: 'unsub',
        sr_name: subredditName,
        api_type: 'json'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    return true
  } catch (error) {
    console.log(error.data)
    return false
  }
}

module.exports = {
  redditUnsubscribeToSubredditFromAreaParameters,
  unsubscribeToSubreddit
}
