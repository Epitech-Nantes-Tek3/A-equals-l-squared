'use strict'

const database = require('../../database_init')
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

/**
 * Connect to the Discord bot thanks to its Token.
 */
client.login(process.env.DISCORD_TOKEN)

/**
 * Called when the Discord bot is ready, here we display all the servers the bot is on.
 */
client.once('ready', () => {
  console.log('Available on servers: ')
  console.log(
    `${client.guilds.cache.map(guild => `\t'${guild.name}'\n`).join('')}`
  )
})

/**
 * @brief Create the Discord service in the database.
 */
const createDiscordService = async () => {
  try {
    const discord = await database.prisma.Service.create({
      data: {
        name: 'Discord',
        description: 'Discord service',
        isEnable: true,
        Actions: {
          create: [
            {
              name: 'onMessage',
              description: 'When a message is sent',
              isEnable: true
            },
            {
              name: 'onVoiceChannel',
              description: 'When a user join a voice channel',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'channelId',
                    description: 'The channel id where the user join',
                    displayName: 'string'
                  }
                ]
              }
            },
            {
              name: 'onReactionAdd',
              description: 'When a user add a reaction to a message',
              isEnable: true
            }
          ]
        },
        Reactions: {
          create: [
            {
              name: 'sendMessageChannel',
              description: 'Send a message on a channel',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'messageContent',
                    description: 'The content of the message',
                    displayName: 'string'
                  },
                  {
                    name: 'channelId',
                    description:
                      'The channel id where the message will be send',
                    displayName: 'string'
                  }
                ]
              }
            },
            {
              name: 'sendMessageUser',
              description: 'Send a message to a user',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'messageContent',
                    description: 'The content of the message',
                    displayName: 'string'
                  },
                  {
                    name: 'UserId',
                    description: 'The user id where the message will be send',
                    displayName: 'string'
                  }
                ]
              }
            },
            {
              name: 'changeActivity',
              description: 'Change the activity of the User',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'activity',
                    description: 'The activity of the user',
                    displayName: 'string'
                  }
                ]
              }
            }
          ]
        }
      }
    })
    console.log('Discord service created : ', discord)
  } catch (error) {
    console.log('Error while creating Discord service : ', error)
  }
}

module.exports = { client, createDiscordService }
