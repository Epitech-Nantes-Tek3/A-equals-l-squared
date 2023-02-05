'use strict'

const database = require('../../database_init')
const { gmailSendEmailFromArea } = require('../gmail/reactions/send_email.js')
const { discordSendMessageChannelFromArea } = require('../discord/reactions/send_message_channel.js')

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
 * Check if the parameters of an action are valid
 * @param {JSON} Area
 * @param {JSON} parametersList
 * @returns
 */
const checkActionParameters = (Area, parametersList) => {
  Area.ActionParameters.forEach(actionParameter => {
    let index = parametersList.findIndex(
      parameter => parameter.name == actionParameter.Parameter.name
    )
    if (index >= 0) {
      if (actionParameter.value == parametersList[index].value) {
        parametersList[index].valid = true
      } else {
        parametersList[index].valid = false
      }
    }
  })
  return parametersList.every(parameter => parameter.valid)
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

  action.UsersHasActionsReactions.forEach(area => {
    const reactions = {
      'GML-01': () => gmailSendEmailFromArea(area),
      'DSC-01': () => discordSendMessageChannelFromArea(area),
      'DSC-02': () => console.log('Send Discord message on user'),
      'DSC-03': () => console.log('Change Discord activity')
    }
    if (!area.isEnable || !area.Reaction.isEnable) {
      return
    }
    if (
      checkActionParameters(area, actionParameters) &&
      reactions[area.Reaction.code]
    ) {
      reactions[area.Reaction.code]()
    }
  })
}

module.exports = {
  AreaGlue
}
