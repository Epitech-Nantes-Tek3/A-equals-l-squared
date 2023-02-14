'use strict'

const { AreaGlue } = require('../../glue/glue.js')
const schedule = require('node-schedule')
const { getATimeTimeJobById } = require('./at_a_date.js')

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
  const rule = createFrequencyRule(area.ActionParameters)
  if (rule == null) return false
  const job = schedule.scheduleJob(
    rule,
    function (area) {
      var currentJob = getATimeTimeJobById(area.id)
      if (currentJob != null) currentJob.occurence -= 1
      if (currentJob != null && currentJob.occurence <= 0)
        destroyATimeTimeAtX(area)
      const parametersList = [
        {
          name: 'every',
          value: area.ActionParameters[0].value,
          valid: false
        },
        {
          name: 'occurence',
          value: area.ActionParameters[1].value,
          valid: false
        }
      ]
      AreaGlue('TMT-02', parametersList)
    }.bind(null, area)
  )
  TimeTimeJobList.push({
    areaId: area.id,
    jobObject: job,
    occurence: parseInt(area.ActionParameters[1].value)
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
