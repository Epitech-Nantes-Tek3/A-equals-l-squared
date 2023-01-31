'use strict'

const client = require('../init').client

/**
 * @brief Triggered when a new user joined the guild.
 * @param {*} user User object
 */
client.on('guildMemberAdd', user => {
  console.log('A new user just joined the Discord server: ' + user.tag)
})
