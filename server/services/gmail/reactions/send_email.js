const gmail = require('../gmail_init').getGmailClient()

/**
 * @brief send an email with the gmail api
 * @param {*} to the email address to send to
 * @param {*} subject the subject of the email
 * @param {*} body the body of the email
 * @returns the response from the gmail api
 */
async function sendEmail (to, subject, body) {
  const message = [
    'From: ' + FROM_EMAIL,
    'To: ' + to,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    'Subject: ' + subject,
    '',
    body
  ].join('\n')

  const base64EncodedEmail = new Buffer.from(message).toString('base64')
  const request = {
    auth: gmail.auth,
    userId: 'me',
    resource: { raw: base64EncodedEmail }
  }
  return gmail.users.messages.send(request)
}

module.exports = { sendEmail }
