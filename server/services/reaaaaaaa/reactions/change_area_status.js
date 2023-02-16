'use strict'

const database = require('../../database_init')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

async function reaaaaaaaChangeAreaStatus (Area, dynamicParameters) {
  try {
    const reactionParameters = Area.reactionParameters
    let changingAreaId = reactionParameters.find(
      parameter => parameter.Parameter.name == 'areaId'
    ).value
    let newStatus = reactionParameters.find(
      parameter => parameter.Parameter.name == 'newStatus'
    ).value
    changingAreaId = replaceDynamicParameters(changingAreaId, dynamicParameters)
    newStatus = replaceDynamicParameters(newStatus, dynamicParameters)
    await database.prisma.UsersHasActionsReactions.update({
      where: { id: changingAreaId },
      data: {
        isEnable: newStatus == 'True' ? true : false
      }
    })
  } catch (err) {
    console.log(err)
    return false
  }
}

module.exports(reaaaaaaaChangeAreaStatus)
