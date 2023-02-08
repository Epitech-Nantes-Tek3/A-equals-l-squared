const gmail = require('../gmail_init').getGmailClient();
// Imports the Google Cloud client library

/**
 * @brief fetch any new mail received
 * @returns the new email
 */
const fetchNewEmail =
    async () => {
  const userId = 'me';
  const request = {
    'labelIds': ['INBOX'],
    'topicName': 'projects/a-equal-l-squared/topics/watch-emails-sub'
  }
  const res =
      gmail.users.watch({auth: gmail.auth, userId: userId, resource: request})
  console.log(`New email received: ${JSON.stringify(res)}`);
}

async function watchNewEmails() {
  try {
    const res = await gmail.users.watch({
      auth: gmail.auth,
      userId: 'me',
      requestBody: {
        labelIds: ['INBOX'],
        topicName: 'projects/a-equal-l-squared/topics/watch-emails-sub'
      }
    });

    console.log(`Watch resource: ${res.data.resourceId}`);
    console.log(`Expiration: ${res.data.expiration}`);
  } catch (err) {
    console.error(err);
  }
}

async function getNewEmail() {
  try {
    const res = await gmail.users.history.list({
      userId: 'me',
      startHistoryId: 1000
    });

    const messages = res.data.history.filter(history => history.messages);

    messages.forEach(message => {
      const msg = message.messages[0];
      console.log(`Message ID: ${msg.id}`);
      console.log(`Thread ID: ${msg.threadId}`);
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  fetchNewEmail,
  watchNewEmails,
  getNewEmail,
};