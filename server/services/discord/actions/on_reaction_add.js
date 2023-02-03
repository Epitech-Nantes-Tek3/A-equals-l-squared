'use strict'

const client = require('../init').client
const { AreaGlue } = require('../../glue/glue.js')

/**
 * @brief Triggered when a user reacts to a message.
 * @param {*} reaction Reaction object
 * @param {*} user User that reacted to the message
 */
client.on('messageReactionAdd', (reaction, user) => {
  console.log(reaction.emoji.name)
  AreaGlue("D-03", ["null"])
})
