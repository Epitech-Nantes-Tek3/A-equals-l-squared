'use strict'

const database = require('../../database_init')

/**
 * Create the Reaaaaaaa service in the Database.
 */
const createReaaaaaaaService = async () => {
  try {
    const rea = await database.prisma.Service.create({
      data: {
        name: 'Reaaaaaaa',
        description: 'Reaaaaaaa service',
        primaryColor: '#03FCA9',
        secondaryColor: '#84FC03',
        icon: './assets/icons/reaaaaaaa.png',
        isEnable: true,
        Actions: {},
        Reactions: {
          create: [
            {
              name: 'changeAreaStatus',
              code: 'REA-01',
              description: 'Change the status of an AREA',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'areaId',
                    description: 'The linked area id',
                    isRequired: true,
                    GetterUrl: '/api/services/rea/getAvailableArea'
                  },
                  {
                    name: 'newStatus',
                    description: 'The new status of the area',
                    isRequired: true,
                    GetterUrl: '/api/services/rea/getAvailableStatus'
                  }
                ]
              }
            }
          ]
        }
      }
    })
    console.log('Reaaaaaaa service created : ', rea)
  } catch (err) {
    console.log('Error while creating Reaaaaaaa service : ', err)
  }
}

module.exports = { createReaaaaaaaService }
