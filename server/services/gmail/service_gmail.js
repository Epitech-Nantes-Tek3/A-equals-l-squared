FROM_EMAIL = 'aequallsquared@gmail.com'

const {google} = require('googleapis');

/**
 *
 * @param {*} to the email address to send to
 * @param {*} subject the subject of the email
 * @param {*} body the body of the email
 * @returns the response from the gmail api
 */
async function sendEmail(to, subject, body) {
  const auth = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);
  auth.setCredentials({refresh_token: process.env.GMAIL_REFRESH_TOKEN});
  auth.scopes = ['https://www.googleapis.com/auth/gmail.send'];
  const message = [
    'From: ' + FROM_EMAIL, 'To: ' + to,
    'Content-Type: text/html; charset=utf-8', 'MIME-Version: 1.0',
    'Subject: ' + subject, '', body
  ].join('\n');

  const base64EncodedEmail = new Buffer.from(message).toString('base64');
  const request = {
    auth: auth,
    userId: 'me',
    resource: {raw: base64EncodedEmail}
  };

  const gmail = google.gmail({version: 'v1', auth});
  return gmail.users.messages.send(request);
}

module.exports = {sendEmail}