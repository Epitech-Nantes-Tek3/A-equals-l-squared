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
                    description: 'The guild concerned guild id',
                    isRequired: true
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
