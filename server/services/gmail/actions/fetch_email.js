const gmail = require('../gmail_init').getGmailClient()

/**
 * @brief fetch any new mail received
 * @returns the new email
 */
const fetchNewEmail = async () => {
  const userId = 'me'
  const request = {
    labelIds: ['INBOX'],
    topicName: 'projects/a-equal-l-squared/topics/watch-emails-sub'
  }
  const res = gmail.users.watch({
    auth: gmail.auth,
    userId: userId,
    resource: request
  })
  console.log(`New email received: ${JSON.stringify(res)}`)
}

/**
 * @brief Create a new watch action with Google Cloud
 */
async function watchNewEmails () {
  try {
    const res = await gmail.users.watch({
      auth: gmail.auth,
      userId: 'me',
      requestBody: {
        labelIds: ['INBOX'],
        topicName: 'projects/a-equal-l-squared/topics/watch-emails-sub'
      }
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * @brief Get the last E-mail received by a specific user
 */
async function getNewEmail () {
  try {
    const res = await gmail.users.history.list({
      userId: 'me',
      startHistoryId: 1000
    })

    const messages = res.data.history.filter(history => history.messages)

    messages.forEach(message => {
      const msg = message.messages[0]
    })
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  fetchNewEmail,
  watchNewEmails,
  getNewEmail
}
