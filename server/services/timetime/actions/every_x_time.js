'use strict'

const { AreaGlue } = require('../../glue/glue.js')
const schedule = require('node-schedule')
const {
  getATimeTimeJobById,
  getParameterValueByName
} = require('./at_a_date.js')

/**
 * Parse all parameters and return the date rule
 * @param {*} parameters the parameters list
 * @returns the date rule object if paramsList is valid, false otherwise
 */
function createFrequencyRule (parameters) {
  if (parseInt(parameters[0].value) < 1) return null
  if (parseInt(parameters[1].value) < 1) return null
  return '*/' + parameters[0].value + ' * * * * *'
}

/**
 * Set a trigger of the Time Time action at X
 * @param {*} area parent area
 * @returns true if the operation succeed, false otherwise
 */
function setATimeTimeAtX (area) {
  const parametersList = [
    {
      name: 'every',
      value: getParameterValueByName(area.ActionParameters, 'every'),
      valid: false
    },
    {
      name: 'occurence',
      value: getParameterValueByName(area.ActionParameters, 'occurence'),
      valid: false
    }
  ]
  const rule = createFrequencyRule(parametersList)
  if (rule == null) return false
  const job = schedule.scheduleJob(
    rule,
    function (area, parametersList) {
      var currentJob = getATimeTimeJobById(area.id)
      if (currentJob != null) currentJob.occurence -= 1
      if (currentJob != null && currentJob.occurence <= 0)
        destroyATimeTimeAtX(area)
      const dynamicParameters = [
        { name: 'CURRENT_DATE', value: new Date().toString() },
        { name: 'REMAINING_OCCURENCE', value: currentJob.occurence }
      ]
      AreaGlue('TMT-02', parametersList, dynamicParameters)
    }.bind(null, area, parametersList)
  )
  TimeTimeJobList.push({
    areaId: area.id,
    jobObject: job,
    occurence: parseInt(parametersList[1].value)
  })
  return true
}

/**
 * Destroy a Time Time job at X
 * @param {*} area parent area
 */
function destroyATimeTimeAtX (area) {
  var currentJob = getATimeTimeJobById(area.id)
  if (currentJob != null && currentJob.jobObject != null)
    currentJob.jobObject.cancel()
  TimeTimeJobList = TimeTimeJobList.filter(function (item) {
    return item !== currentJob
  })
}

module.exports = { setATimeTimeAtX, destroyATimeTimeAtX }
