'use strict'

const database = require('../../database_init')

/**
 * @brief Create the TimeTime service in the database.
 */
const createTimeTimeService = async () => {
  try {
    const timetime = await database.prisma.Service.create({
      data: {
        name: 'TimeTime',
        description: 'Time scheduler service',
        primaryColor: '#BCBCBC',
        secondaryColor: '#FFFFFF',
        icon: '',
        isEnable: false,
        Actions: {
          create: [
            {
              name: 'atADate',
              code: 'TMT-01',
              description: 'Do something at a custom Date',
              isEnable: false,
              Parameters: {
                create: [
                  {
                    name: 'year',
                    description: 'The wanted year',
                    isRequired: true
                  },
                  {
                    name: 'month',
                    description: 'The wanted month',
                    isRequired: true
                  },
                  {
                    name: 'day',
                    description: 'The wanted day',
                    isRequired: true
                  },
                  {
                    name: 'hour',
                    description: 'The wanted hour',
                    isRequired: false
                  },
                  {
                    name: 'minute',
                    description: 'The wanted minute',
                    isRequired: false
                  },
                  {
                    name: 'second',
                    description: 'The wanted second',
                    isRequired: false
                  }
                ]
              }
            },
            {
              name: 'everyXTime',
              code: 'TMT-02',
              description: 'Do something every X time',
              isEnable: false,
              Parameters: {
                create: [
                  {
                    name: 'every',
                    description: 'The wanted time in seconds',
                    isRequired: true
                  },
                  {
                    name: 'occurence',
                    description: 'How many time you wanted to repeat it ?',
                    isRequired: true
                  }
                ]
              }
            }
          ]
        },
        Reactions: {}
      }
    })
    console.log('TimeTime service created : ', timetime)
  } catch (error) {
    console.log('Error while creating TimeTime service : ', error)
  }
}

module.exports = { createTimeTimeService }
