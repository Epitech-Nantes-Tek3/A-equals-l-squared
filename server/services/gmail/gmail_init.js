FROM_EMAIL = 'aequallsquared@gmail.com'

const database = require('../../database_init')
const { google } = require('googleapis')

/**
 * @brief create the gmail service in the database
 */
const createGmailService = async () => {
  try {
    const gmail = await database.prisma.Service.create({
      data: {
        name: 'gmail',
        description: 'Email service',
        isEnable: true,
        primaryColor: '#EA4335',
        secondaryColor: '#FFFFFF',
        icon: './assets/icons/gmail.png',
        Actions: {},
        Reactions: {
          create: [
            {
              name: 'SendEmail',
              code: 'GML-01',
              description: 'Send an email',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'from',
                    description: 'The gmail account to send from',
                    isRequired: true,
                    GetterUrl: '/api/services/gmail/getAvailablePerformers'
                  },
                  {
                    name: 'to',
                    description: 'The email address to send to',
                    isRequired: true
                  },
                  {
                    name: 'subject',
                    description: 'The subject of the email',
                    isRequired: true
                  },
                  {
                    name: 'body',
                    description: 'The body of the email',
                    isRequired: false
                  }
                ]
              }
            }
          ]
        }
      }
    })
    console.log('Gmail service created : ', gmail)
    return gmail
  } catch (error) {
    console.log('Error while creating Gmail service : ', error)
  }
}

/**
 * @brief create the gmail client with the credentials
 * @returns the gmail client
 */
const getGmailClient = () => {
  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  )
  auth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
  auth.scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/pubsub'
  ]

  return google.gmail({ version: 'v1', auth })
}

/**
 * Create the gmail service if it does not already exist.
 */
const generateGmailService = async database => {
  const gmailService = await database.prisma.Service.findMany({
    where: { name: 'gmail' }
  })
  if (gmailService.length === 0) {
    console.log('Creating gmail service...')
    return await createGmailService()
  } else {
    console.log('Gmail service already exist.')
    return gmailService[0]
  }
}

module.exports = {
  generateGmailService,
  getGmailClient
}
