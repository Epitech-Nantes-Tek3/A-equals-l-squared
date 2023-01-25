const gmail = require('../gmail_init').getGmailClient();

async function readEmail(emailId) {
  try {
    const email = await gmail.users.messages.get({userId: 'me', id: emailId});
    console.log(email.data.snippet);
  } catch (err) {
    console.log(`An error occurred: ${err}`);
  }
}

async function searchEmails(query) {
  try {
    const response = await gmail.users.messages.list({userId: 'me', q: query});
    const messages = response.data.messages;
    if (messages.length) {
      // iterate through the messages and get the id
      for (let i = 0; i < messages.length; i++) {
        const email =
            await gmail.users.messages.get({userId: 'me', id: messages[i].id});
        console.log(email.data.id)
        console.log(email.data.snippet);
      }
    } else {
      console.log('No email found.');
    }
  } catch (err) {
    console.log(`An error occurred: ${err}`);
  }
}

module.exports = {
  readEmail,
  searchEmails,
};