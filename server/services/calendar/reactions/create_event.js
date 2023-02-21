const calendar = require('../calendar_init').getCalendarClient()
const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')
const { google } = require('googleapis')

const calendarCreateEventFromArea = async (Area, dynamicParameters) => {
  try {
    const reactionParameters = Area.ReactionParameters
    let from = reactionParameters
                  .find(parameter => parameter.Parameter.name == 'from')
                  .value
    let calendarId =
        reactionParameters
            .find(parameter => parameter.Parameter.name == 'calendarId')
            .value
    let summary = reactionParameters
                      .find(parameter => parameter.Parameter.name == 'summary')
                      .value
    summary = replaceDynamicParameters(summary, dynamicParameters)

    let description =
        reactionParameters
            .find(parameter => parameter.Parameter.name == 'description')
            .value
    description = replaceDynamicParameters(description, dynamicParameters)

    let start = reactionParameters
                    .find(parameter => parameter.Parameter.name == 'start')
                    .value
    start = replaceDynamicParameters(start, dynamicParameters)

    let end =
        reactionParameters.find(parameter => parameter.Parameter.name == 'end')
            .value
    end = replaceDynamicParameters(end, dynamicParameters)

    return await createEvent(from, calendarId, summary, description, start, end)
  } catch (error) {
    console.log('Error while creating event from area : ', error)
  }
}

/**
 * @brief create an event
 * @param {*} calendarId the calendar id
 * @param {*} summary the summary of the event
 * @param {*} description the description of the event
 * @param {*} start the start date of the event
 * @param {*} end the end date of the event
 * @returns the created event
 * @throws error if the event is not created
 * @see https://developers.google.com/calendar/v3/reference/events/insert
 */
const createEvent =
    async (from = null, calendarId='primary', summary, description, start, end) => {
  try {
    if (from)
      createEventWithAccessToken(from, calendarId, summary, description, start, end)
    else {
      const response = await calendar.events.insert({
        calendarId: calendarId,
        requestBody: {
          summary: summary,
          location: 'Nantes',
          description: description,
          start: {dateTime: start, timeZone: 'Europe/Paris'},
          end: {dateTime: end, timeZone: 'Europe/Paris'}
        }
      })
      return response.data
    }
  } catch (err) {
    console.log(`An error occurred: ${err}`)
    throw err
  }
}

const createEventWithAccessToken = async (accessToken, calendarId, summary, description, start, end) => {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  auth.scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ]
  const client = google.calendar({ version: 'v3', auth })
  try {
    const response = await client.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: summary,
        location: 'Nantes',
        description: description,
        start: {dateTime: start, timeZone: 'Europe/Paris'},
        end: {dateTime: end, timeZone: 'Europe/Paris'}
      },
    })
    return response.data
  } catch (err) {
    console.log(`Error creating event: ${err}`)
    throw err
  }
}

module.exports = {
  createEvent,
  calendarCreateEventFromArea,
  createEventWithAccessToken
}