'use strict'

const { AreaGlue } = require('../../glue/glue.js')

async function setATimeTimeAtADate (area) {
  console.log('A TimeTime trigger have been set')
}

async function destroyATimeTimeAtADate (area) {
  console.log('A TimeTime trigger have been deleted')
}

module.exports = { setATimeTimeAtADate, destroyATimeTimeAtADate }
