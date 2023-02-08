const gmail = require('../gmail_init').getGmailClient()

/**
 * @brief send an email with the gmail api from an area
 * @param {*} Area Area that contains the parameters
 * @returns the response from the gmail api
 */
async function gmailSendEmailFromArea (Area) {
  try {
    const reactionParameters = Area.ReactionParameters
    const to = reactionParameters.find(
      parameter => parameter.Parameter.name == 'to'
    ).value
    const subject = reactionParameters.find(
      parameter => parameter.Parameter.name == 'subject'
    ).value
    const body = reactionParameters.find(
      parameter => parameter.Parameter.name == 'body'
    ).value
    return await sendEmail(to, subject, body)
  } catch (error) {
    console.log('Error while sending email from area : ', error)
  }
}

function getBase64message(from, to, subject, body) {
  const message = [
    'From: ' + FROM_EMAIL, 'To: ' + to,
    'Content-Type: text/html; charset=utf-8', 'MIME-Version: 1.0',
    'Subject: ' + subject, '', body
  ].join('\n');

  const base64EncodedEmail = new Buffer.from(message).toString('base64');
  return base64EncodedEmail;
}

/**
 * @brief send an email with the gmail api
 * @param {*} to the email address to send to
 * @param {*} subject the subject of the email
 * @param {*} body the body of the email
 * @returns the response from the gmail api
 */
const sendEmail = async (to, subject, body) => {
  const request = {
    auth: gmail.auth,
    userId: 'me',
    resource: {raw: getBase64message(FROM_EMAIL, to, subject, body)}
  };
  return gmail.users.messages.send(request);
}


const sendEmailWithAccessToken = async (accessToken, to, subject, body) => {
  const client = google.gmail({version: 'v1', auth: accessToken});
  try {
    const result = await client.users.messages.send({
      userId: 'me',
      requestBody: { raw: getBase64message(FROM_EMAIL, to, subject, body) },
    });
    console.log(`Email sent successfully with ID: ${result.data.id}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
}

module.exports = {sendEmail, sendEmailWithAccessToken };
