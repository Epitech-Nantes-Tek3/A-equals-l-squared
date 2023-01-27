FROM_EMAIL = 'aequallsquared@gmail.com'

const database = require('../../database_init')
const {google} = require('googleapis');

const createGmailService =
    async () => {
  const gmailService = {
    name: 'Gmail',
    description: 'Gmail service',
    isEnable: false,
    createdAt: new Date(),
    Actions: [{
      name: 'Read email',
      description: 'Read an email',
      isEnable: false,
      createdAt: new Date(),
    }],
    Reactions: [{
      name: 'Send email',
      description: 'Send an email',
      isEnable: false,
      createdAt: new Date(),
    }],
  };
  await database.prisma.Service.create({data: gmailService});
}


/**
 * @brief create the gmail client with the credentials
 * @returns the gmail client
 */
const getGmailClient =
    () => {
      const auth = new google.auth.OAuth2(
          process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);
      auth.setCredentials({refresh_token: process.env.GMAIL_REFRESH_TOKEN});
      auth.scopes = ['https://www.googleapis.com/auth/gmail.send'];

      return google.gmail({version: 'v1', auth});
    }

module.exports = {
      createGmailService,
      getGmailClient
}