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
 * Called by actions, it will call the appropriate reactions
 * @param {String} actionCode
 * @param {JSON} actionParameters
 * @returns
 */
const AreaGlue = async (actionCode, actionParameters) => {
  const action = await getActionFromCode(actionCode)
  if (!action || !action.isEnable) {
    return
  }

  const reactions = {
    'GML-01': () => console.log('Send email'),
    'DSC-01': () => console.log('Send Discord message on channel'),
    'DSC-02': () => console.log('Send Discord message on user'),
    'DSC-03': () => console.log('Change Discord activity')
  }

  action.UsersHasActionsReactions.forEach(area => {
    if (area.isEnable == false || area.Reaction.isEnable == false) {
      return
    }
    const reaction = reactions[area.Reaction.code]
    if (reaction) {
      reaction()
    }
  })
}

module.exports = {
  AreaGlue
}
