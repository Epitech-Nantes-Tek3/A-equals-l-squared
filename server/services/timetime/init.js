'use strict'

const database = require('../../database_init')
const {
  setATimeTimeAtADate,
  destroyATimeTimeAtADate
} = require('./actions/at_a_date')
const {
  setATimeTimeAtX,
  destroyATimeTimeAtX
} = require('./actions/every_x_time')

/**
 * Global variable storing all the Time Time Job
 */
global.TimeTimeJobList = []

/**
 * Map containing all the Trigger init function
 */
global.TriggerInitMap = {
  'TMT-01': setATimeTimeAtADate,
  'TMT-02': setATimeTimeAtX
}

/**
 * Map containing all the Trigger destroy function
 */
global.TriggerDestroyMap = {
  'TMT-01': destroyATimeTimeAtADate,
  'TMT-02': destroyATimeTimeAtX
}

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
        icon: 'assets/icons/timetime.png',
        isEnable: true,
        Actions: {
          create: [
            {
              name: 'atADate',
              code: 'TMT-01',
              description: 'Do something at a custom Date',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'date',
                    description: 'The wanted date (YEAR/MM/DD)',
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
              },
              DynamicParameters: {
                create: [
                  {
                    name: 'CURRENT_DATE',
                    description: 'The current date'
                  }
                ]
              }
            },
            {
              name: 'everyXTime',
              code: 'TMT-02',
              description: 'Do something every X time',
              isEnable: true,
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
              },
              DynamicParameters: {
                create: [
                  {
                    name: 'CURRENT_DATE',
                    description: 'The current date'
                  },
                  {
                    name: 'REMAINING_OCCURENCE',
                    description: 'Number of remaining occurence'
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
    return timetime
  } catch (error) {
    console.log('Error while creating TimeTime service : ', error)
  }
}

/**
 * Create the timetime service if it does not already exist.
 */
const generateTimeTimeService = async database => {
  const timeTimeService = await database.prisma.Service.findMany({
    where: { name: 'timetime' }
  })
  if (timeTimeService.length === 0) {
    console.log('Creating timetime service...')
    return await createTimeTimeService()
  } else {
    console.log('Timetime service already exist.')
    return timeTimeService[0]
  }
}

module.exports = {
  generateTimeTimeService,
  TriggerInitMap,
  TriggerDestroyMap
}
