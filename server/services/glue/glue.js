'use strict'

const database = require('../../database_init')

/**
 * Get an action from its code
 * @param {String} code
 * @returns
 */
const getActionFromCode = async code => {
  const action = await database.prisma.Action.findUnique({
    where: {
      code: code
    },
    select: {
      isEnable: true,
      Parameters: true,
      UsersHasActionsReactions: {
        select: {
          isEnable: true,
          User: {
            select: {
              id: true,
              email: true,
              googleId: true,
              facebookId: true
            }
          },
          ActionParameters: {
            select: {
              Parameter: true,
              value: true
            }
          },
          Reaction: {
            select: {
              code: true,
              Parameters: true,
              isEnable: true
            }
          },
          ReactionParameters: {
            select: {
              Parameter: true,
              value: true
            }
          }
        }
      }
    }
  })
  return action
}

/**
 * Called by actionss, it will call the appropriate reaction
 * @param {String} actionCode
 * @param {JSON} actionParameters
 * @returns
 */
const AreaGlue = async (actionCode, actionParameters) => {
  console.log('AreaGlue called')
  const action = await getActionFromCode(actionCode)
  if (!action) {
    return
  }
  if (!action.isEnable) {
    throw new Error('Action is not enable')
  }
  action.UsersHasActionsReactions.forEach(area => {
    if (area.isEnable == false || area.Reaction.isEnable == false) {
      return
    }
    if (area.Reaction.code == 'GML-01') {
      console.log('Send email')
      return
    }
    if (area.Reaction.code == 'DSC-01') {
      console.log('Send Discord message on channel')
      return
    }
    if (area.Reaction.code == 'DSC-02') {
      console.log('Send Discord message on user')
      return
    }
    if (area.Reaction.code == 'DSC-03') {
      console.log('Change Discord activity')
      return
    }
  })
}

module.exports = {
  AreaGlue
}
