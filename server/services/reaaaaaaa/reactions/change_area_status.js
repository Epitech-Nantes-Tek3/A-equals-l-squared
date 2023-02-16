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
    const reactionParameters = Area.ReactionParameters
    let changingAreaId = reactionParameters.find(
      parameter => parameter.Parameter.name == 'areaId'
    ).value
    let newStatus = reactionParameters.find(
      parameter => parameter.Parameter.name == 'newStatus'
    ).value
    changingAreaId = replaceDynamicParameters(changingAreaId, dynamicParameters)
    newStatus = replaceDynamicParameters(newStatus, dynamicParameters)
    const changingArea = await database.prisma.UsersHasActionsReactions.update({
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

module.exports = { reaaaaaaaChangeAreaStatus }
