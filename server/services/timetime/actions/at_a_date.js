'use strict'

const { AreaGlue } = require('../../glue/glue.js')
var { TimeTimeJobList, getATimeTimeJobById } = require('../init.js')
const schedule = require('node-schedule')

function setATimeTimeAtADate (area) {
  const rule = new schedule.RecurrenceRule()
  rule.second = 15
  const job = schedule.scheduleJob(
    rule,
    function (area) {
      var currentJob = getATimeTimeJobById(area.id)
      if (currentJob != null) currentJob.occurence -= 1
      if (currentJob != null && currentJob.occurence == 0)
        destroyATimeTimeAtADate(area)
    }.bind(null, area)
  )
  TimeTimeJobList.push({ areaId: area.id, jobObject: job, occurence: -1 })
}

function destroyATimeTimeAtADate (area) {
  var currentJob = getATimeTimeJobById(area.id)
  if (currentJob != null) currentJob.jobObject.cancel()
  TimeTimeJobList = TimeTimeJobList.filter(function (item) {
    return item !== currentJob
  })
  console.log('A TimeTime trigger have been deleted')
}

module.exports = { setATimeTimeAtADate, destroyATimeTimeAtADate }
