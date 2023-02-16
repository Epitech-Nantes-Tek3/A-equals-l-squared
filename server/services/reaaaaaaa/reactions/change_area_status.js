'use strict'

const database = require('../../../database_init')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

/**
 * Change the status of a specified area
 * @param {*} Area Area that contains the parameters
 * @param {*} dynamicParameters Dynamic parameters
 * @returns True if the status have been updated, false otherwise
 */
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
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

module.exports = { reaaaaaaaChangeAreaStatus }
