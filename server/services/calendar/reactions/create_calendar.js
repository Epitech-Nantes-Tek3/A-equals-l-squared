const calendar = require('../calendar_init').getCalendarClient()
const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')
const { google } = require('googleapis')

/**
 * @brief create an event
 * @param {*} Area the area
 * @param {*} dynamicParameters the dynamic parameters
 * @returns
 */
const calendarCreateCalendarFromArea = async (Area, dynamicParameters) => {
    try {
        const reactionParameters = Area.ReactionParameters
        let from = reactionParameters
            .find(parameter => parameter.Parameter.name == 'from')
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

        return await createCalendar(from, summary, description)
    }
    catch (error) {
        console.log('Error while creating calendar from area : ', error)
    }
}

/**
 * @brief create an calendar
 * @param {*} summary the summary of the calendar
 * @param {*} description the description of the calendar
 * @returns the created calendar
 * @throws error if the calendar is not created
 */
const createCalendar =
    async (from, summary, description) => {
  try {
    if (from && from != 'aequallsquared@gmail.com')
      createCalendarWithAccessToken(from, summary, description)
    else {
      const response = await calendar.calendars.insert({
        requestBody: {
          summary: summary,
          description: description,
          timeZone: 'Europe/Paris'
        }
      })
      return response.data
    }
  } catch (err) {
    console.log(`An error occurred in create calendar: ${err}`)
    throw err
  }
}

/**
 *
 * @param {*} accessToken the access token
 * @param {*} calendarId the calendar id
 * @param {*} summary the summary of the calendar
 * @param {*} description the description of the calendar
 * @param {*} start the start date of the calendar
 * @param {*} end the end date of the calendar
 * @returns
 */
const createCalendarWithAccessToken = async (accessToken, summary, description) => {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  auth.scopes = ['https://www.googleapis.com/auth/calendar']
  const client = google.calendar({ version: 'v3', auth })
  try {
    const response = await client.calendars.insert({
        requestBody: {
          summary: summary,
          description: description,
          timeZone: 'Europe/Paris'
        }
    })
    return response.data
  } catch (err) {
    console.log(`Error creating calendar: ${err}`)
    throw err
  }
}

module.exports = {
  createCalendar,
  calendarCreateCalendarFromArea,
  createCalendarWithAccessToken
}
