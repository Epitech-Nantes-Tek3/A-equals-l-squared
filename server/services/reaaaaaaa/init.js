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
                    description: 'The linked area name',
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
    return rea
  } catch (err) {
    console.log('Error while creating Reaaaaaaa service : ', err)
  }
}

/**
 * Create the reaaaaaaa service if it does not already exist.
 */
const generateReaaaaaaaService = async database => {
  const reaaaaaaaService = await database.prisma.Service.findMany({
    where: { name: 'Reaaaaaaa' }
  })
  if (reaaaaaaaService.length === 0) {
    console.log('Creating Reaaaaaaa service...')
    return await createReaaaaaaaService()
  } else {
    console.log('Reaaaaaaa service already exist.')
    return reaaaaaaaService[0]
  }
}

module.exports = { generateReaaaaaaaService }
