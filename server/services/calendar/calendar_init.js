const database = require('../../database_init')
const { google } = require('googleapis')

/**
 * @brief create the calendar service in the database
 */
const createCalendarService = async () => {
  try {
    const calendar = await database.prisma.Service.create({
      data: {
        name: 'Calendar',
        description: 'Calendar service',
        isEnable: true,
        primaryColor: '#4285F4',
        secondaryColor: '#FFFFFF',
        icon: './assets/icons/calendar.png',
        Actions: {},
        Reactions: {
          create: [
            {
              name: 'CreateEvent',
              code: 'CAL-01',
              description: 'Create an event',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'calendarId',
                    description:
                      'The calendar id, by default the primary calendar',
                    isRequired: false,
                    GetterUrl: '/api/services/calendar/getAvailableCalendars'
                  },
                  {
                    name: 'summary',
                    description: 'The summary of the event',
                    isRequired: true
                  },
                  {
                    name: 'description',
                    description: 'The description of the event',
                    isRequired: false
                  },
                  {
                    name: 'start',
                    description: 'The start date of the event at the ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)',
                    isRequired: true
                  },
                  {
                    name: 'end',
                    description: 'The end date of the event at the ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)',
                    isRequired: true
                  }
                ]
              }
            },
            {
              name: 'CreateCalendar',
              code: 'CAL-02',
              description: 'Create a calendar',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'summary',
                    description: 'The summary of the calendar',
                    isRequired: true
                  },
                  {
                    name: 'description',
                    description: 'The description of the calendar',
                    isRequired: false
                  }
                ]
              }
            }
          ]
        }
      }
    })
    console.log('Calendar service created : ', calendar)
  } catch (error) {
    console.log('Error while creating Calendar service : ', error)
  }
}

/**
 * @brief create the calendar client with the credentials
 * @returns the calendar client
 */
const getCalendarClient = () => {
  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  )
  auth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
  auth.scopes = ['https://www.googleapis.com/auth/calendar']

  return google.calendar({ version: 'v3', auth })
}

/**
 * Create the calendar service if it does not already exist.
 */
const generateCalendarService = async database => {
  const calendarService = await database.prisma.Service.findMany({
    where: { name: 'calendar' }
  })
  if (calendarService.length === 0) {
    console.log('Creating calendar service...')
    return await createCalendarService()
  } else {
    console.log('Calendar service already exist.')
    return calendarService[0]
  }
}

module.exports = {
  generateCalendarService,
  getCalendarClient
}
