'use strict'

const database = require('../../database_init')
const { gmailSendEmailFromArea } = require('../gmail/reactions/send_email.js')
const {
  discordSendMessageChannelFromArea
} = require('../discord/reactions/send_message_channel.js')
const {
  discordSendPrivateMessageFromArea
} = require('../discord/reactions/send_private_message.js')
const {
  discordchangeActivityFromArea
} = require('../discord/reactions/change_activity.js')
const {
  setATimeTimeAtADate,
  destroyATimeTimeAtADate
} = require('../timetime/actions/at_a_date')

const TriggerInitMap = {
  'TMT-01': setATimeTimeAtADate
}

const TriggerDestroyMap = {
  'TMT-01': destroyATimeTimeAtADate
}

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
      'DSC-02': () => discordSendPrivateMessageFromArea(area),
      'DSC-03': () => discordchangeActivityFromArea(area)
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
  AreaGlue,
  TriggerInitMap,
  TriggerDestroyMap
}
