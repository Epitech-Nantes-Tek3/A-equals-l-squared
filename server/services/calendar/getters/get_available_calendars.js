'use strict'

const { google } = require('googleapis')

/**
 * @brief Get all calendars where the user has access.
 * @param {*} accessToken
 */
const getAvailableCalendars = async accessToken => {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  auth.scopes = ['https://www.googleapis.com/auth/calendar']
  const calendar = google.calendar({ version: 'v3', auth })
  const calendars = await calendar.calendarList
    .list({})
    .then(res => {
      var curr_calendar = {}
      var available_calendars = []
      if (res.data.items.length) {
        res.data.items.forEach(calendar => {
          curr_calendar = {
            id: calendar.id,
            name: calendar.summary
          }
          available_calendars.push(curr_calendar)
        })
        return available_calendars
      } else {
        console.log('No calendars found.')
        return null
      }
    })
    .catch(err => {
      console.error('Error:', err)
      return null
    })
  return calendars
}

module.exports = getAvailableCalendars
