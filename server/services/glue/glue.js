'use strict'

const database = require('../../database_init')

const getActionFromCode = async code => {
  const action = await database.prisma.Action.findUnique({
    where: {
      code: code
    }
  })
  return action
}

const AreaGlue = async (actionCode, actionParameters) => {
  const action = await getActionFromCode(actionCode)
  console.log('AreaGlue : ', action, actionParameters)
}

module.exports = {
  AreaGlue
}
