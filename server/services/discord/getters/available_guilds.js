'use strict'

const client = require('../init').client

/**
 * @brief Get all guilds where the bot is connected.
 * @returns An array of guilds with their ID and name.
 */
function getAvailableGuilds () {
  var guilds = []
  client.guilds.cache.filter(guild => {
    guild = {
      id: guild.id,
      name: guild.name
    }
    guilds.push(guild)
  })
  return guilds
}

module.exports = getAvailableGuilds
