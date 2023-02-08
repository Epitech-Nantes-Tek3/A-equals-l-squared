const gmail = require('../gmail_init').getGmailClient();
// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

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

async function quickstart(
  projectId = 'a-equal-l-squared', // Your Google Cloud Platform project ID
  topicNameOrId = 'my-topic', // Name for the new topic to create
  subscriptionName = 'my-sub' // Name for the new subscription to create
) {
  // Instantiates a client
  const pubsub = new PubSub({projectId});

  // Creates a new topic
  const [topic] = await pubsub.createTopic(topicNameOrId);
  console.log(`Topic ${topic.name} created.`);

  // Creates a subscription on that new topic
  const [subscription] = await topic.createSubscription(subscriptionName);

  // Receive callbacks for new messages on the subscription
  subscription.on('message', message => {
    console.log('Received message:', message.data.toString());
    process.exit(0);
  });

  // Receive callbacks for errors on the subscription
  subscription.on('error', error => {
    console.error('Received error:', error);
    process.exit(1);
  });

  // Send a message to the topic
  topic.publish(Buffer.from('Test message!'));
}

module.exports = {
  fetchNewEmail,
  watchNewEmails,
  getNewEmail,
  quickstart
};