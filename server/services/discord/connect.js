'use strict'

const { Client, Intents } = require('discord.js')

const client = new Client({
  intents: [
    Intents.Guilds,
    Intents.GuildMessages,
    Intents.MessageContent,
    Intents.GuildMembers,
    Intents.GuildMessageReactions,
    Intents.DirectMessages
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.login(process.env.DISCORD_TOKEN)

client.once('ready', () => {
  console.log('Available on servers: ')
  console.log(
    `${client.guilds.cache.map(guild => `\t'${guild.name}'\n`).join('')}`
  )
})

module.exports = client
