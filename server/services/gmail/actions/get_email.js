const gmail = require('../gmail_init').getGmailClient()

/**
 * @brief get the emails with the given query
 * @param {*} query the query to search for
 * @returns the emails
 * @throws error if the emails are not found
 */
const getEmailsbyQuery = async query => {
  try {
    const response = await gmail.users.messages.list({ userId: 'me', q: query })
    const messages = response.data.messages
    if (messages.length) {
      return messages
    } else {
      console.log('No email found.')
      return null
    }
  } catch (err) {
    console.log(`An error occurred: ${err}`)
    throw err
  }
}

/**
 * @brief get the email with the given id
 * @param {*} emailId the id of the email
 * @returns the email
 * @throws error if the email is not found
 */
const getEmail = async emailId => {
  try {
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: emailId
    })
    return response.data
  } catch (err) {
    console.log(`An error occurred: ${err}`)
    throw err
  }
}

module.exports = {
  getEmailsbyQuery,
  getEmail
}
