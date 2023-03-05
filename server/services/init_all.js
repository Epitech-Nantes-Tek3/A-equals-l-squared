'use strict'

const { generateGmailService } = require('./gmail/gmail_init')
const { generateCalendarService } = require('./calendar/calendar_init')
const { generateDiscordService } = require('./discord/init')
const { generateRedditService } = require('./reddit/init')
const { generateDeezerService } = require('./deezer/init')
const { generateReaaaaaaaService } = require('./reaaaaaaa/init')
const { generateTimeTimeService } = require('./timetime/init')

const generateAllServices = async database => {
  await generateDiscordService(database)
  await generateGmailService(database)
  await generateCalendarService(database)
  await generateTimeTimeService(database)
  await generateReaaaaaaaService(database)
  await generateDeezerService(database)
  await generateRedditService(database)
}

module.exports = { generateAllServices }
