const calendar = require('../calendar_init').getCalendarClient()
const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')
const { google } = require('googleapis')

/**
 * @brief create an calendar
 * @param {*} ReactionParameters the parameters
 * @param {*} dynamicParameters the dynamic parameters
 * @param {*} User the user
 * @returns
 */
const calendarCreateCalendarFromAreaParameters = async (
  ReactionParameters,
  dynamicParameters,
  User
) => {
  try {
    let summary = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'summary'
    ).value
    summary = replaceDynamicParameters(summary, dynamicParameters)

    let description = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'description'
    ).value
    description = replaceDynamicParameters(description, dynamicParameters)

    return await createCalendar(User.googleToken, summary, description)
  } catch (error) {
    console.log('Error while creating calendar from area : ', error)
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
const createCalendar = async (accessToken, summary, description) => {
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
  calendarCreateCalendarFromAreaParameters
}
