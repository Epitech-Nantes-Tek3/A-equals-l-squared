'use strict'

const axios = require('axios')

/**
 * @brief Subscribe to a subreddit created recently
 * @param {*} token Reddit token of the user
 * @returns True if it was successful, false otherwise
 */
async function redditSubscribeToNewSubreddit (token) {
  try {
    const response_get = await axios.get(
      'http://oauth.reddit.com/subreddits/new',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    if (response_get.status == 200) {
      const subredditName = response_get.data.data.children[0].data.display_name
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
    }
    return false
  } catch (error) {
    console.log(error.data)
    return false
  }
}

module.exports = {
  redditSubscribeToNewSubreddit
}
