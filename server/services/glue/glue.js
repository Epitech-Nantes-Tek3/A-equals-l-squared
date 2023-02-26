'use strict'

const database = require('../../database_init')
const {
  gmailSendEmailFromAreaParameters
} = require('../gmail/reactions/send_email')
const {
  discordSendMessageChannelFromAreaParameters
} = require('../discord/reactions/send_message_channel')
const {
  discordSendPrivateMessageFromAreaParameters
} = require('../discord/reactions/send_private_message')
const {
  discordChangeActivityFromAreaParameters
} = require('../discord/reactions/change_activity')
const {
  reaaaaaaaChangeAreaStatusFromAreaParameters
} = require('../reaaaaaaa/reactions/change_area_status')
const {
  calendarCreateEventFromAreaParameters
} = require('../calendar/reactions/create_event')
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
      AREAsLink: {
        select: {
          id: true,
          triggered: true,
          AREA: {
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
              Actions: {
                select: {
                  Action: {
                    select: {
                      code: true,
                      isEnable: true
                    }
                  },
                  ActionParameters: {
                    select: {
                      Parameter: true,
                      value: true
                    }
                  }
                }
              },
              Reactions: {
                select: {
                  Reaction: {
                    select: {
                      code: true,
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
          },
          ActionParameters: {
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
 * @param {JSON} ActionParameters The parameters of the action
 * @param {JSON} parametersList The given parameters
 * @returns
 */
const checkActionParameters = (ActionParameters, parametersList) => {
  ActionParameters.forEach(actionParameter => {
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

  new Promise((resolve, reject) => {
    action.AREAsLink.forEach(async link => {
      console.log("Link", link)
      // List of reactions to call
      const reactionsList = {
        'GML-01': ReactionParameters =>
          gmailSendEmailFromAreaParameters(
            ReactionParameters,
            dynamicParameters
          ),
        'DSC-01': ReactionParameters =>
          discordSendMessageChannelFromAreaParameters(
            ReactionParameters,
            dynamicParameters
          ),
        'DSC-02': ReactionParameters =>
          discordSendPrivateMessageFromAreaParameters(
            ReactionParameters,
            dynamicParameters
          ),
        'DSC-03': ReactionParameters =>
          discordChangeActivityFromAreaParameters(
            ReactionParameters,
            dynamicParameters
          ),
        'REA-01': ReactionParameters =>
          reaaaaaaaChangeAreaStatusFromAreaParameters(
            ReactionParameters,
            dynamicParameters
          ),
        'CAL-01': ReactionParameters =>
          calendarCreateEventFromAreaParameters(
            ReactionParameters,
            dynamicParameters
          )
      }
      if (
        !link.AREA.isEnable ||
        !checkActionParameters(link.ActionParameters, actionParameters)
      ) {
        return
      }
      link.AREA.Reactions.forEach(reaction => {
        if (!reaction.Reaction.isEnable) {
          return
        }
        if (reactionsList[reaction.Reaction.code]) {
          reactionsList[reaction.Reaction.code](reaction.ReactionParameters)
        }
      })
      const response = await database.prisma.AREAhasActions.update({
        where: {
          id: link.id
        },
        data: {
          triggered: true
        }
      })
      console.log("Response", response)
    })
  })
}

module.exports = {
  AreaGlue
}
