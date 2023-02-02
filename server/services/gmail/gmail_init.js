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
        description: 'Gmail service',
        isEnable: true,
        Actions: {
          create: [
            {
              name: 'get_email',
              description: 'Get email by id',
              isEnable: true,
              parameters: {
                create: [
                  {
                    name: 'emailId',
                    description: 'The id of the email',
                    displayName: 'String'
                  }
                ]
              }
            },
            {
              name: 'get_emails_by_query',
              description: 'Get emails by query',
              isEnable: true,
              parameters: {
                create: [
                  {
                    name: 'query',
                    description: 'The query to search for'
                  }
                ]
              }
            }
          ]
        },
        Reactions: {
          create: [
            {
              name: 'send_email',
              description: 'Send an email',
              isEnable: true,
              parameters: {
                create: [
                  {
                    name: 'to',
                    description: 'The email address to send to',
                    displayName: 'String'
                  },
                  {
                    name: 'subject',
                    description: 'The subject of the email',
                    displayName: 'String'
                  },
                  {
                    name: 'body',
                    description: 'The body of the email',
                    displayName: 'String'
                  }
                ]
              }
            }
          ]
        }
      }
    })
    console.log('Gmail service created : ', gmail)
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
  auth.scopes = ['https://www.googleapis.com/auth/gmail.send']

  return google.gmail({ version: 'v1', auth })
}

module.exports = {
  createGmailService,
  getGmailClient
}
