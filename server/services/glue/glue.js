'use strict'

const database = require('../../database_init')
const { gmailSendEmailFromArea } = require('../gmail/reactions/send_email')
const {
  discordSendMessageChannelFromArea
} = require('../discord/reactions/send_message_channel')
const {
  discordSendPrivateMessageFromArea
} = require('../discord/reactions/send_private_message')
const {
  discordChangeActivityFromArea
} = require('../discord/reactions/change_activity')
const {
  reaaaaaaaChangeAreaStatus
} = require('../reaaaaaaa/reactions/change_area_status')
const {
  calendarCreateEventFromArea
} = require('../calendar/reactions/create_event')
const {
  calendarCreateCalendarFromArea
} = require('../calendar/reactions/create_calendar')
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
              googleToken: true,
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
 * @param {JSON} dynamicParameters
 * @returns
 */
const AreaGlue = async (actionCode, actionParameters, dynamicParameters) => {
  const action = await getActionFromCode(actionCode)
  if (!action || !action.isEnable) {
    return
  }

  action.UsersHasActionsReactions.forEach(area => {
    const reactions = {
      'GML-01': () => gmailSendEmailFromArea(area, dynamicParameters),
      'DSC-01': () =>
        discordSendMessageChannelFromArea(area, dynamicParameters),
      'DSC-02': () =>
        discordSendPrivateMessageFromArea(area, dynamicParameters),
      'DSC-03': () => discordChangeActivityFromArea(area, dynamicParameters),
      'REA-01': () => reaaaaaaaChangeAreaStatus(area, dynamicParameters),
      'CAL-01': () => calendarCreateEventFromArea(area, dynamicParameters),
      'CAL-02': () => calendarCreateCalendarFromArea(area, dynamicParameters),
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
