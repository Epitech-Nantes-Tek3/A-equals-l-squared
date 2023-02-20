const database = require('../../database_init')
const { google } = require('googleapis')

/**
 * @brief create the calendar service in the database
 */
const createCalendarService = async () => {
    try {
        const calendar = await database.prisma.Service.create({
            data: {
                name: 'calendar',
                description: 'Calendar service',
                isEnable: true,
                primaryColor: '#4285F4',
                secondaryColor: '#FFFFFF',
                icon: './assets/icons/calendar.png',
                Actions: {},
                Reactions: {
                    create: [
                        {
                            name: 'create_event',
                            code: 'CAL-02',
                            description: 'Create an event',
                            isEnable: true,
                            Parameters: {
                                create: [
                                    {
                                        name: 'from',
                                        description: 'The google account which will create the event',
                                        isRequired: true,
                                        GetterUrl: '/api/services/calendar/getAvailablePerformers'
                                    },
                                    {
                                        name: 'calendarId',
                                        description: 'The calendar id, by default the primary calendar',
                                        isRequired: true,
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
                                        description: 'The start date of the event',
                                        isRequired: true
                                    },
                                    {
                                        name: 'end',
                                        description: 'The end date of the event',
                                        isRequired: true
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

module.exports = {
    createCalendarService,
    getCalendarClient
}