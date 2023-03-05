'use strict'

const database = require('../../database_init')

/**
 * @brief Create the Deezer service in the database.
 */
const createDeezerService = async () => {
  try {
    const deezer = await database.prisma.Service.create({
      data: {
        name: 'Deezer',
        description: 'Music streaming service',
        primaryColor: '#323232',
        secondaryColor: '#EF5466',
        icon: './assets/icons/deezer.png',
        isEnable: true,
        Actions: {},
        Reactions: {
          create: [
            {
              name: 'createPlaylist',
              code: 'DZR-01',
              description: 'Create a new empty playlist',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'title',
                    description: 'The title of the playlist',
                    isRequired: false
                  }
                ]
              }
            },
            {
              name: 'deletePlaylist',
              code: 'DZR-02',
              description: 'Delete a owned playlist',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'playlistId',
                    description: 'The playlist name',
                    isRequired: true,
                    GetterUrl: '/api/services/deezer/getUserPlaylists'
                  }
                ]
              }
            },
            {
              name: 'clearPlaylist',
              code: 'DZR-03',
              description: 'Clear a owned playlist',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'playlistId',
                    description: 'The playlist name',
                    isRequired: true,
                    GetterUrl: '/api/services/deezer/getUserPlaylists'
                  }
                ]
              }
            },
            {
              name: 'addHistoryToPlaylist',
              code: 'DZR-04',
              description:
                'Add a few tracks of your history to a owned playlist',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'playlistId',
                    description: 'The playlist name',
                    isRequired: true,
                    GetterUrl: '/api/services/deezer/getUserPlaylists'
                  },
                  {
                    name: 'limit',
                    description: 'The number of tracks to add',
                    isRequired: false
                  }
                ]
              }
            },
            {
              name: 'addRecommendationsToPlaylist',
              code: 'DZR-05',
              description:
                'Add a few tracks of your recommendations to a owned playlist',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'playlistId',
                    description: 'The playlist name',
                    isRequired: true,
                    GetterUrl: '/api/services/deezer/getUserPlaylists'
                  },
                  {
                    name: 'limit',
                    description: 'The number of tracks to add',
                    isRequired: false
                  }
                ]
              }
            }
          ]
        }
      }
    })
    console.log('Deezer service created : ', deezer)
    return deezer
  } catch (error) {
    console.log('Error while creating Deezer service : ', error)
  }
}

/**
 * Create the deezer service if it does not already exist.
 */
const generateDeezerService = async database => {
  const deezerService = await database.prisma.Service.findMany({
    where: { name: 'deezer' }
  })
  if (deezerService.length === 0) {
    console.log('Creating deezer service...')
    return await createDeezerService()
  } else {
    console.log('Deezer service already exist.')
    return deezerService[0]
  }
}

module.exports = { generateDeezerService }
