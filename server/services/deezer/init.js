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
        description: 'Deezer service',
        primaryColor: '#323232',
        secondaryColor: '#EF5466',
        icon: '',
        isEnable: true,
        Actions: {
          create: [
            {
              name: '',
              code: 'DZR-01',
              description: '',
              isEnable: false,
              Parameters: {
                create: [
                  {
                    name: '',
                    description: '',
                    isRequired: true,
                    GetterUrl: ''
                  }
                ]
              }
            }
          ]
        },
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
                    name: 'name',
                    description: 'The name of the playlist',
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
                    description: 'The playlist id',
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
                    description: 'The playlist id',
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
                    description: 'The playlist id',
                    isRequired: true,
                    GetterUrl: '/api/services/deezer/getUserPlaylists'
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
                    description: 'The playlist id',
                    isRequired: true,
                    GetterUrl: '/api/services/deezer/getUserPlaylists'
                  }
                ]
              }
            }
          ]
        }
      }
    })
    console.log('Deezer service created : ', deezer)
  } catch (error) {
    console.log('Error while creating Deezer service : ', error)
  }
}

module.exports = { createDeezerService }
