'use strict'

const axios = require('axios')
const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

/**
 * @brief Subscribe to a subreddit from an area
 * @param {*} Area Area that contains the parameters
 * @param {*} dynamicParameters Dynamic parameters
 * @returns True if it was successful, false otherwise
 */
function redditSubscribeToSubredditFromArea (Area, dynamicParameters) {
  const reactionParameters = Area.ReactionParameters
  let subredditName = reactionParameters.find(
    parameter => parameter.Parameter.name == 'subredditName'
  ).value
  subredditName = replaceDynamicParameters(subredditName, dynamicParameters)
  return subscribeToSubreddit(Area.User.redditToken, subredditName)
}

/**
 * @brief Subscribe to a subreddit
 * @param {*} token Reddit token of the user
 * @param {*} subredditName Name of the subreddit
 * @returns True if it was successful, false otherwise
 */
async function subscribeToSubreddit (token, subredditName) {
  try {
    const response = await axios.post(
      `https://oauth.reddit.com/api/subscribe`,
      {
        action: 'sub',
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
  redditSubscribeToSubredditFromArea,
  subscribeToSubreddit
}
