'use strict'

const { AreaGlue } = require('../../glue/glue.js')
const schedule = require('node-schedule')

function getATimeTimeJobById (id) {
  for (var temp of TimeTimeJobList) {
    if (temp.areaId == id) {
      return temp
    }
  }
  return null
}

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

function setATimeTimeAtADate (area) {
  const rule = parseAreaParameterToGetDate(area.ActionParameters)
  console.log(rule)
  if (rule == null) return false
  const job = schedule.scheduleJob(
    rule,
    function (area) {
      var currentJob = getATimeTimeJobById(area.id)
      if (currentJob != null) currentJob.occurence -= 1
      console.log(currentJob)
      if (currentJob != null && currentJob.occurence <= 0)
        destroyATimeTimeAtADate(area)
      const parametersList = [
        {
          name: 'date',
          value: area.ActionParameters[0].value,
          valid: false
        },
        {
          name: 'hour',
          value: area.ActionParameters[1].value,
          valid: false
        },
        {
          name: 'minute',
          value: area.ActionParameters[2].value,
          valid: false
        },
        {
          name: 'second',
          value: area.ActionParameters[3].value,
          valid: false
        }
      ]
      console.log('Send to glue.')
      AreaGlue('TMT-01', parametersList)
    }.bind(null, area)
  )
  TimeTimeJobList.push({ areaId: area.id, jobObject: job, occurence: 1 })
  return true
}

function destroyATimeTimeAtADate (area) {
  var currentJob = getATimeTimeJobById(area.id)
  if (currentJob != null) currentJob.jobObject.cancel()
  TimeTimeJobList = TimeTimeJobList.filter(function (item) {
    return item !== currentJob
  })
  area.isEnable = false
  console.log('A TimeTime trigger have been deleted')
}

module.exports = { setATimeTimeAtADate, destroyATimeTimeAtADate }
