'use strict'

const client = require('../init').client
const axios = require('axios')

/**
 * @brief Get all guilds where the bot is connected.
 * @returns An array of guilds with their ID and name.
 */
async function getAvailableGuilds (accessToken) {
  const tokenType = 'Bearer'
  var guilds = []
  var curr_guild = {}

  try {
    const response = await axios.get(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: {
          authorization: `${tokenType} ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    if (response.status !== 200) return null
    response.data.forEach(guild => {
      if ((guild.permissions & 8) === 8) {
        if (client.guilds.cache.get(guild.id) === undefined) return
        curr_guild = {
          id: guild.id,
          name: guild.name
        }
        guilds.push(curr_guild)
      }
    })
    return guilds
  } catch (error) {
    console.error(error)
    return null
  }
}

module.exports = getAvailableGuilds
