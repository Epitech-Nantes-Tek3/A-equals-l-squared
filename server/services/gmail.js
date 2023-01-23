REFRESH_TOKEN= '1//04l2lTADkLP2HCgYIARAAGAQSNwF-L9IryG2TaXEn8sXad7Ym2XI0sauL-7PCS-2kQSA3saZZ5FagZ6OVe2PYmFk21l8JwgQTcdI'
FROM_EMAIL = 'aequallsquared@gmail.com'

const {google} = require('googleapis');
const credentials = require('../credentials/credentials.json');
console.log(credentials);
// initialize the Gmail API client


async function sendEmail(to, subject, body) {
  const auth = new google.auth.OAuth2(credentials.web.client_id, credentials.web.client_secret);
  auth.setCredentials({refresh_token: REFRESH_TOKEN});
  auth.scopes = ['https://www.googleapis.com/auth/gmail.send'];
  const message = [
    'From: '+ FROM_EMAIL,
    'To: ' + to,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    'Subject: ' + subject,
    '',
    body
  ].join('\n');

  const base64EncodedEmail = new Buffer.from(message).toString('base64');
  const request = {
    auth: auth,
    userId: 'me',
    resource: {
      raw: base64EncodedEmail
    }
  };

  console.log(`Email sent to ${to}!`);
  const gmail = google.gmail({version: 'v1', auth});
  return gmail.users.messages.send(request);
}

module.exports =
{
  sendEmail
}