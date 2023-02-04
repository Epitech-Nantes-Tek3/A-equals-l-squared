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
    AreaGlue('DSC-03', ['null'])
  } catch (error) {
    console.error(error)
  }
})
