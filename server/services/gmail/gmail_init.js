FROM_EMAIL = 'aequallsquared@gmail.com'

const {google} = require('googleapis');

/**
 *
 * @returns the gmail client
 */
function getGmailClient() {
  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET
  );
  auth.setCredentials({refresh_token: process.env.GMAIL_REFRESH_TOKEN});
  auth.scopes = ['https://www.googleapis.com/auth/gmail.send'];

  return google.gmail({version: 'v1', auth});
}

module.exports = {getGmailClient}