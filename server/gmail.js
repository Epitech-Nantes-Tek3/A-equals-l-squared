// CLIENT_ID="770124443966-v34ujnge4avgs7hb1jt6do9f24ebp54m.apps.googleusercontent.com"

// CLIENT_SECRET="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"

// REDIRECT_URI="https%3A%2F%2Fdevelopers.google.com%2Foauthplayground"

// REFRESH_TOKEN="1//04H-Ur6-oBXPXCgYIARAAGAQSNwF-L9IrBATgXFjFwwpLPi3_XAHa-yoegvoovy_iFTdMQqB0K-Sw9Dh_9f8nSe5QWzCvhBc4ADw"

const {google} = require('googleapis');
const credentials = require('./credentials.json');

// initialize the Gmail API client
const gmail = google.gmail({version: 'v1', credentials});


async function sendEmail(to, subject, body) {
  // create the message
  const auth = new google.auth.OAuth2();
  auth.setCredentials({access_token: 'yaZ29.a0AVvZVsoKAU4UFn09fNTtBB0xbv-H0FRcmykjoy5MIKC_gmWPsUKjj60m7oXfZIC5bzNjq4Euz8E6DD9_36m5g231oW8qx-CeDSJMFLNFcUK6yyQqDXTGMC_SQJYc4g8-v4okpoui5Eqk7WOWGo3hn-ciLp1vaCgYKAZkSARMSFQGbdwaI9RyS-M7m-UexlyN33ITEow0163'});
  const message = [
    'From: '+ 'aequallsquared@gmail.com',
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
  return gmail.users.messages.send(request);
}

module.exports =
{
    sendEmail
}