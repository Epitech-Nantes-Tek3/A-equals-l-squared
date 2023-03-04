const gmail = require('../gmail_init').getGmailClient()
const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')
const { google } = require('googleapis')

/**
 * @brief send an email with the gmail api from an area
 * @param {*} ReactionParameters The parameters
 * @param {*} dynamicParameters the dynamic parameters to replace in the email
 * @param {*} User the user
 * @returns the response from the gmail api
 */
async function gmailSendEmailFromAreaParameters (
  ReactionParameters,
  dynamicParameters,
  User
) {
  try {
    let from = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'from'
    ).value
    let to = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'to'
    ).value
    to = replaceDynamicParameters(to, dynamicParameters)

    let subject = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'subject'
    ).value
    subject = replaceDynamicParameters(subject, dynamicParameters)

    let body = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'body'
    ).value
    body = replaceDynamicParameters(body, dynamicParameters)

    return await sendEmail(from, to, subject, body)
  } catch (error) {
    console.log('Error while sending email from area : ', error)
  }
}

/**
 *
 * @param {*} from the email address to send from
 * @param {*} to the email address to send to
 * @param {*} subject the subject of the email
 * @param {*} body the body of the email
 * @returns the base64 encoded email
 */
function getBase64message (from, to, subject, body) {
  const message = [
    'From: ' + from,
    'To: ' + to,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    'Subject: ' + subject,
    '',
    body
  ].join('\n')

  const base64EncodedEmail = new Buffer.from(message).toString('base64')
  return base64EncodedEmail
}

/**
 * @brief send an email with the gmail api
 * @param {*} from the gmail account to send from
 * @param {*} to the email address to send to
 * @param {*} subject the subject of the email
 * @param {*} body the body of the email
 * @returns the response from the gmail api
 */
const sendEmail = async (from = null, to, subject, body) => {
  if (from == null || from === 'aequallsquared@gmail.com') {
    const request = {
      auth: gmail.auth,
      userId: 'me',
      resource: { raw: getBase64message(FROM_EMAIL, to, subject, body) }
    }
    return gmail.users.messages.send(request)
  } else {
    return sendEmailWithAccessToken(from, to, subject, body)
  }
}

/**
 *
 * @param {*} accessToken the access token to use for the authentication
 * @param {*} to the email address to send to
 * @param {*} subject the subject of the email
 * @param {*} body the body of the email
 */
const sendEmailWithAccessToken = async (accessToken, to, subject, body) => {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  auth.scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly'
  ]
  const client = google.gmail({ version: 'v1', auth })
  try {
    const userProfile = await client.users.getProfile({ userId: 'me' })
    const from = userProfile.data.emailAddress
    await client.users.messages.send({
      userId: 'me',
      requestBody: { raw: getBase64message(from, to, subject, body) }
    })
  } catch (error) {
    console.error(`Error sending email: ${error}`)
  }
}

module.exports = {
  sendEmail,
  gmailSendEmailFromAreaParameters
}
