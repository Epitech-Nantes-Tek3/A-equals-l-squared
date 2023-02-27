const calendar = require('../calendar_init').getCalendarClient()
const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')
const { google } = require('googleapis')

/**
 * @brief create an event
 * @param {*} ReactionParameters the parameters
 * @param {*} dynamicParameters the dynamic parameters
 * @param {*} User the user
 * @returns
 */
const calendarCreateEventFromAreaParameters = async (
  ReactionParameters,
  dynamicParameters,
  User
) => {
  try {
    let calendarId = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'calendarId'
    ).value
    let summary = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'summary'
    ).value
    summary = replaceDynamicParameters(summary, dynamicParameters)

    let description = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'description'
    ).value
    description = replaceDynamicParameters(description, dynamicParameters)

    let start = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'start'
    ).value
    start = replaceDynamicParameters(start, dynamicParameters)

    let end = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'end'
    ).value
    end = replaceDynamicParameters(end, dynamicParameters)

    return await createEvent(
      User.googleToken,
      calendarId,
      summary,
      description,
      start,
      end
    )
  } catch (error) {
    console.log('Error while creating event from area : ', error)
  }
}

/**
 * @brief create an event
 * @param {*} accessToken the access token
 * @param {*} calendarId the calendar id
 * @param {*} summary the summary of the event
 * @param {*} description the description of the event
 * @param {*} start the start date of the event
 * @param {*} end the end date of the event
 * @returns
 */
const createEvent = async (
  accessToken,
  calendarId = 'primary',
  summary,
  description,
  start,
  end
) => {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  auth.scopes = ['https://www.googleapis.com/auth/calendar']
  const client = google.calendar({ version: 'v3', auth })
  const isValidISODate = dateStr => {
    return !isNaN(Date.parse(dateStr))
  }

  if (!isValidISODate(start)) {
    throw new Error('Invalid start date format. Must be in ISO 8601 format.')
  }
  if (!isValidISODate(end)) {
    throw new Error('Invalid end date format. Must be in ISO 8601 format.')
  }
  try {
    const response = await client.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: summary,
        location: 'Nantes',
        description: description,
        start: { dateTime: start, timeZone: 'Europe/Paris' },
        end: { dateTime: end, timeZone: 'Europe/Paris' }
      }
    })
    return response.data
  } catch (err) {
    console.log(`Error creating event: ${err}`)
    throw err
  }
}

module.exports = {
  createEvent,
  calendarCreateEventFromAreaParameters
}
