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
  console.log('Discord bot ready !')
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
              code: 'DSC-01',
              description: 'When a message is sent',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'guildId',
                    description: 'The concerned guild id',
                    isRequired: true,
                    ProposalUrl: '/api/services/discord/getAvailableGuilds'
                  },
                  {
                    name: 'channelId',
                    description: 'The channel id where the message is sent',
                    isRequired: true,
                    ProposalUrl: '/api/services/discord/getTextChannels',
                    ProposalBody: true
                  }
                ]
              }
            },
            {
              name: 'onVoiceChannel',
              code: 'DSC-02',
              description: 'When a user join a voice channel',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'guildId',
                    description: 'The concerned guild id',
                    isRequired: true,
                    ProposalUrl: '/api/services/discord/getAvailableGuilds'
                  },
                  {
                    name: 'channelId',
                    description: 'The channel id where the user join',
                    isRequired: true,
                    ProposalUrl: '/api/services/discord/getVoiceChannels',
                    ProposalBody: true
                  }
                ]
              }
            },
            {
              name: 'onMemberJoining',
              code: 'DSC-03',
              description: 'When a user join a guild',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'guildId',
                    description: 'The concerned guild id',
                    isRequired: true,
                    ProposalUrl: '/api/services/discord/getAvailableGuilds'
                  }
                ]
              }
            },
            {
              name: 'onReactionAdd',
              code: 'DSC-04',
              description: 'When a user add a reaction to a message',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'guildId',
                    description: 'The guild concerned guild id',
                    isRequired: true,
                    ProposalUrl: '/api/services/discord/getAvailableGuilds'
                  },
                  {
                    name: 'channelId',
                    description: 'The channel id where the message is sent',
                    isRequired: true,
                    ProposalUrl: '/api/services/discord/getTextChannels',
                    ProposalBody: true
                  }
                ]
              }
            }
          ]
        },
        Reactions: {
          create: [
            {
              name: 'sendMessageChannel',
              code: 'DSC-01',
              description: 'Send a message on a channel',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'messageContent',
                    description: 'The content of the message',
                    isRequired: true
                  },
                  {
                    name: 'guildId',
                    description: 'The guild concerned guild id',
                    isRequired: true,
                    ProposalUrl: '/api/services/discord/getAvailableGuilds'
                  },
                  {
                    name: 'channelId',
                    description:
                      'The channel id where the message will be send',
                    isRequired: true,
                    ProposalUrl: '/api/services/discord/getTextChannels',
                    ProposalBody: true
                  }
                ]
              }
            },
            {
              name: 'sendMessageUser',
              code: 'DSC-02',
              description: 'Send a message to a user',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'messageContent',
                    description: 'The content of the message',
                    isRequired: true
                  },
                  {
                    name: 'UserId',
                    description: 'The user id where the message will be send',
                    isRequired: true
                  }
                ]
              }
            },
            {
              name: 'changeActivity',
              code: 'DSC-03',
              description: 'Change the activity of the User',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'activity',
                    description: 'The activity of the user',
                    isRequired: true
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
