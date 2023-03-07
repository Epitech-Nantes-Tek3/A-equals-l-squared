'use strict'

const { AreaGlue } = require('../../glue/glue.js')
const schedule = require('node-schedule')

/**
 * Return a time time job by the area id
 * @param {*} id area id
 * @returns the time time job
 */
function getATimeTimeJobById (id) {
  for (var temp of TimeTimeJobList) {
    if (temp.areaId == id) {
      return temp
    }
  }
  return null
}

/**
 * Parse all parameters and return a valid date object
 * @param {*} paramsList the parameters list
 * @returns the date object if paramsList is valid, false otherwise
 */
function parseAreaParameterToGetDate (paramsList) {
  try {
    const year = paramsList[0].value.split('/')[0]
    const month = paramsList[0].value.split('/')[1]
    const day = paramsList[0].value.split('/')[2]
    const hour = paramsList[1].value != '' ? paramsList[1].value : '0'
    const min = paramsList[2].value != '' ? paramsList[2].value : '0'
    const sec = paramsList[3].value != '' ? paramsList[3].value : '0'
    if (isNaN(parseInt(year)) || isNaN(parseInt(month)) || isNaN(parseInt(day)))
      return null
    if (
      parseInt(year) < 2023 ||
      parseInt(month) < 1 ||
      parseInt(month) > 12 ||
      parseInt(day) < 1 ||
      parseInt(day) > 31
    )
      return null
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour) - 1,
      parseInt(min),
      parseInt(sec)
    )
  } catch (err) {
    console.log(err)
    return null
  }
}

/**
 * Find a parameter value by his name
 * @param {*} paramsList The parameters list
 * @param {*} name the parameter name
 * @returns the parameter value
 */
function getParameterValueByName (paramsList, name) {
  let found = ''
  paramsList.forEach(actionParameter => {
    if (actionParameter.Parameter.name == name) found = actionParameter.value
  })
  return found
}

/**
 * Set a trigger of the Time Time action at Date
 * @param {*} area parent area
 * @returns true if the operation succeed, false otherwise
 */
function setATimeTimeAtADate (area) {
  const parametersList = [
    {
      name: 'date',
      value: getParameterValueByName(area.ActionParameters, 'date'),
      valid: false
    },
    {
      name: 'hour',
      value: getParameterValueByName(area.ActionParameters, 'hour'),
      valid: false
    },
    {
      name: 'minute',
      value: getParameterValueByName(area.ActionParameters, 'minute'),
      valid: false
    },
    {
      name: 'second',
      value: getParameterValueByName(area.ActionParameters, 'second'),
      valid: false
    }
  ]
  const rule = parseAreaParameterToGetDate(parametersList)
  if (rule == null) return false
  const job = schedule.scheduleJob(
    rule,
    function (area, parametersList) {
      var currentJob = getATimeTimeJobById(area.id)
      if (currentJob != null) currentJob.occurence -= 1
      if (currentJob != null && currentJob.occurence <= 0)
        destroyATimeTimeAtADate(area)
      const dynamicParameters = [
        { name: 'CURRENT_DATE', value: new Date().toString() }
      ]
      AreaGlue('TMT-01', parametersList, dynamicParameters)
    }.bind(null, area, parametersList)
  )
  TimeTimeJobList.push({ areaId: area.id, jobObject: job, occurence: 1 })
  return true
}

/**
 * Destroy a Time Time job at Date
 * @param {} area parent area
 */
function destroyATimeTimeAtADate (area) {
  var currentJob = getATimeTimeJobById(area.id)
  if (currentJob != null && currentJob.jobObject != null)
    currentJob.jobObject.cancel()
  TimeTimeJobList = TimeTimeJobList.filter(function (item) {
    return item !== currentJob
  })
}

module.exports = {
  setATimeTimeAtADate,
  destroyATimeTimeAtADate,
  getATimeTimeJobById,
  getParameterValueByName
}
