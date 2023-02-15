'use strict'

const client = require('../init').client
const { AreaGlue } = require('../../glue/glue.js')

/**
 * @brief Triggered when a new user joined the guild.
 * @param {*} user User object
 */
client.on('guildMemberAdd', user => {
  try {
    console.log('A new user just joined the Discord server: ' + user.tag)

    const dynamicParameters = [
      { name: 'USER_NAME', value: user.username },
      { name: 'USER_ID', value: user.id },
      { name: 'GUILD_NAME', value: user.guild.name },
      { name: 'GUILD_ID', value: user.guild.id }
    ]
    AreaGlue('DSC-03', [], dynamicParameters)
  } catch (error) {
    console.error(error)
  }
})
