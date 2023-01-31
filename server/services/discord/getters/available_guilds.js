'use strict'

const client = require('../init').client

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
