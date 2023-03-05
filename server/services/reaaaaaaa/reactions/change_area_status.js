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
async function reaaaaaaaChangeAreaStatusFromAreaParameters (
  ReactionParameters,
  dynamicParameters,
  User
) {
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
        isEnable: true,
        userId: true,
        Actions: {
          select: {
            id: true,
            Action: {
              select: {
                id: true,
                name: true,
                isEnable: true,
                code: true
              }
            },
            ActionParameters: {
              select: {
                id: true,
                Parameter: {
                  select: {
                    name: true
                  }
                },
                value: true
              }
            }
          }
        }
      }
    })
    for (let action of changingArea.Actions) {
      if (changingArea.isEnable && TriggerInitMap[action.Action.code])
        TriggerInitMap[action.Action.code](action)
      if (!changingArea.isEnable && TriggerDestroyMap[action.Action.code])
        TriggerDestroyMap[action.Action.code](action)
    }
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

module.exports = { reaaaaaaaChangeAreaStatusFromAreaParameters }
