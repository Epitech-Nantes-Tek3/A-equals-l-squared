'use strict'

const database = require('../../../database_init')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

/**
 * Change the status of a specified area
 * @param {*} ReactionParameters The parameters
 * @param {*} dynamicParameters Dynamic parameters
 * @param {*} User the user
 * @returns True if the status have been updated, false otherwise
 */
async function reaaaaaaaChangeAreaStatusFromAreaParameters (ReactionParameters, dynamicParameters, User) {
  try {
    let changingAreaId = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'areaId'
    ).value
    let newStatus = ReactionParameters.find(
      parameter => parameter.Parameter.name == 'newStatus'
    ).value
    changingAreaId = replaceDynamicParameters(changingAreaId, dynamicParameters)
    newStatus = replaceDynamicParameters(newStatus, dynamicParameters)
    const changingArea = await database.prisma.AREA.update({
      where: { id: changingAreaId },
      data: {
        isEnable: newStatus == 'True'
      },
      select: {
        id: true,
        User: true,
        ActionParameters: {
          include: {
            Parameter: true
          }
        },
        Action: true
      }
    })
    if (TriggerInitMap[changingArea.Action.code])
      TriggerInitMap[changingArea.Action.code](changingArea)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

module.exports = { reaaaaaaaChangeAreaStatusFromAreaParameters }
