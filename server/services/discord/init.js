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
        description: 'Chat service',
        primaryColor: '#7289DA',
        secondaryColor: '#2C2F33',
        icon: './assets/icons/discord.png',
        isEnable: true,
        Actions: {
          create: [
            {
              name: 'onMessage',
              code: 'DSC-01',
              description: 'When a message is received',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'guildId',
                    description: 'The concerned guild id',
                    isRequired: true,
                    GetterUrl: '/api/services/discord/getAvailableGuilds'
                  },
                  {
                    name: 'channelId',
                    description: 'The channel id where the message is sent',
                    isRequired: true,
                    GetterUrl: '/api/services/discord/getTextChannels'
                  }
                ]
              },
              DynamicParameters: {
                create: [
                  {
                    name: 'MESSAGE_ID',
                    description: 'The id of the message sent'
                  },
                  {
                    name: 'MESSAGE_CONTENT',
                    description: 'The content of the message sent'
                  },
                  {
                    name: 'USER_NAME',
                    description: 'The username of the author of the message'
                  },
                  {
                    name: 'USER_ID',
                    description: 'The user ID of the author of the message'
                  },
                  {
                    name: 'CHANNEL_NAME',
                    description:
                      'The name of the channel where the message is sent'
                  },
                  {
                    name: 'CHANNEL_ID',
                    description:
                      'The ID of the channel where the message is sent'
                  },
                  {
                    name: 'GUILD_NAME',
                    description:
                      'The name of the guild where the message is sent'
                  },
                  {
                    name: 'GUILD_ID',
                    description: 'The ID of the guild where the message is sent'
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
                    GetterUrl: '/api/services/discord/getAvailableGuilds'
                  },
                  {
                    name: 'channelId',
                    description: 'The channel id where the user join',
                    isRequired: true,
                    GetterUrl: '/api/services/discord/getVoiceChannels'
                  }
                ]
              },
              DynamicParameters: {}
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
                    GetterUrl: '/api/services/discord/getAvailableGuilds'
                  }
                ]
              },
              DynamicParameters: {
                create: [
                  {
                    name: 'USER_NAME',
                    description: 'The username of the user who join the guild'
                  },
                  {
                    name: 'USER_ID',
                    description: 'The ID of the user who join the guild'
                  },
                  {
                    name: 'GUILD_NAME',
                    description: 'The name of the guild where the user join'
                  },
                  {
                    name: 'GUILD_ID',
                    description: 'The ID of the guild where the user join'
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
                    GetterUrl: '/api/services/discord/getAvailableGuilds'
                  },
                  {
                    name: 'channelId',
                    description: 'The channel id where the message is sent',
                    isRequired: true,
                    GetterUrl: '/api/services/discord/getTextChannels'
                  }
                ]
              },
              DynamicParameters: {
                create: [
                  {
                    name: 'REACTION',
                    description: 'The reaction added'
                  },
                  {
                    name: 'MESSAGE_ID',
                    description:
                      'The ID of the message where the reaction is added'
                  },
                  {
                    name: 'USER_NAME',
                    description: 'The username of the author of the reaction'
                  },
                  {
                    name: 'USER_ID',
                    description: 'The user ID of the author of the reaction'
                  },
                  {
                    name: 'CHANNEL_NAME',
                    description:
                      'The name of the channel where the reaction is added'
                  },
                  {
                    name: 'CHANNEL_ID',
                    description:
                      'The ID of the channel where the reaction is added'
                  },
                  {
                    name: 'GUILD_NAME',
                    description: 'The name of guild where the reaction is added'
                  },
                  {
                    name: 'GUILD_ID',
                    description: 'The ID of guild where the reaction is added'
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
                    name: 'guildId',
                    description: 'The guild concerned guild id',
                    isRequired: true,
                    GetterUrl: '/api/services/discord/getAvailableGuilds'
                  },
                  {
                    name: 'channelId',
                    description:
                      'The channel id where the message will be send',
                    isRequired: true,
                    GetterUrl: '/api/services/discord/getTextChannels'
                  },
                  {
                    name: 'messageContent',
                    description: 'The content of the message',
                    isRequired: true
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
                    name: 'UserId',
                    description: 'The user id where the message will be send',
                    isRequired: true
                  },
                  {
                    name: 'messageContent',
                    description: 'The content of the message',
                    isRequired: true
                  }
                ]
              }
            },
            {
              name: 'changeActivity',
              code: 'DSC-03',
              description: 'Change the activity of the Bot',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'activity',
                    description: 'The activity of the bot',
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
    return discord
  } catch (error) {
    console.log('Error while creating Discord service : ', error)
  }
}

/**
 * Create the discord service if it does not already exist.
 */
const generateDiscordService = async database => {
  const discordService = await database.prisma.Service.findMany({
    where: { name: 'discord' }
  })
  if (discordService.length === 0) {
    console.log('Creating discord service...')
    return await createDiscordService()
  } else {
    console.log('Discord service already exist.')
    return discordService[0]
  }
}

module.exports = { client, generateDiscordService }
