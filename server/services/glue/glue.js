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
  deezerCreatePlaylistFromAreaParameters
} = require('../deezer/reactions/create_playlist')
const {
  deezerDeletePlaylistFromAreaParameters
} = require('../deezer/reactions/delete_playlist')
const {
  deezerClearPlaylistFromAreaParameters
} = require('../deezer/reactions/clear_playlist')
const {
  deezerAddHistoryToPlaylistFromAreaParameters
} = require('../deezer/reactions/add_history_to_playlist')
const {
  deezerAddRecommendationsToPlaylistFromAreaParameters
} = require('../deezer/reactions/add_recommendations_to_playlist')

const {
  reaaaaaaaChangeAreaStatusFromAreaParameters
} = require('../reaaaaaaa/reactions/change_area_status')

const {
  redditUnsubscribeToSubredditFromAreaParameters
} = require('../reddit/reactions/subreddit_unsubscribe')
const {
  redditSubscribeToSubredditFromAreaParameters
} = require('../reddit/reactions/subreddit_subscribe_to')
const {
  redditSubscribeToNewSubreddit
} = require('../reddit/reactions/subreddit_subscribe_new')

const {
  calendarCreateEventFromAreaParameters
} = require('../calendar/reactions/create_event')
const {
  calendarCreateCalendarFromAreaParameters
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
      AREAsLink: {
        select: {
          id: true,
          triggered: true,
          AREA: {
            select: {
              isEnable: true,
              logicalGate: true,
              User: {
                select: {
                  id: true,
                  email: true,
                  googleId: true,
                  googleToken: true,
                  facebookId: true,
                  deezerId: true,
                  deezerToken: true,
                  redditToken: true
                }
              },
              Actions: {
                select: {
                  id: true,
                  triggered: true,
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

const reactionsList = {
  'GML-01': (ReactionParameters, dynamicParameters, User) =>
    gmailSendEmailFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'DSC-01': (ReactionParameters, dynamicParameters, User) =>
    discordSendMessageChannelFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'DSC-02': (ReactionParameters, dynamicParameters, User) =>
    discordSendPrivateMessageFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'DSC-03': (ReactionParameters, dynamicParameters, User) =>
    discordChangeActivityFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'REA-01': (ReactionParameters, dynamicParameters, User) =>
    reaaaaaaaChangeAreaStatusFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'CAL-01': (ReactionParameters, dynamicParameters, User) =>
    calendarCreateEventFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'CAL-02': (ReactionParameters, dynamicParameters, User) =>
    calendarCreateCalendarFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'DZR-01': (ReactionParameters, dynamicParameters, User) =>
    deezerCreatePlaylistFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'DZR-02': (ReactionParameters, dynamicParameters, User) =>
    deezerDeletePlaylistFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'DZR-03': (ReactionParameters, dynamicParameters, User) =>
    deezerClearPlaylistFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'DZR-04': (ReactionParameters, dynamicParameters, User) =>
    deezerAddHistoryToPlaylistFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'DZR-05': (ReactionParameters, dynamicParameters, User) =>
    deezerAddRecommendationsToPlaylistFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'RDT-01': (ReactionParameters, dynamicParameters, User) =>
    redditSubscribeToSubredditFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'RDT-02': (ReactionParameters, dynamicParameters, User) =>
    redditUnsubscribeToSubredditFromAreaParameters(
      ReactionParameters,
      dynamicParameters,
      User
    ),
  'RDT-03': (ReactionParameters, dynamicParameters, User) =>
    redditSubscribeToNewSubreddit(User.redditToken)
}

const updateTriggeredLink = async (linkId, triggered) => {
  await database.prisma.AREAhasActions.update({
    where: {
      id: linkId
    },
    data: {
      triggered: triggered
    }
  })
}

/**
 * Call the reactions
 * @param {*} Reactions The reactions to call
 * @param {*} dynamicParameters The dynamic parameters
 */
const callReactions = async (Reactions, dynamicParameters, User) => {
  Reactions.forEach(reaction => {
    if (!reaction.Reaction.isEnable) {
      return
    }
    if (reactionsList[reaction.Reaction.code]) {
      reactionsList[reaction.Reaction.code](
        reaction.ReactionParameters,
        dynamicParameters,
        User
      )
    }
  })
}

/**
 * Handle the AND gate
 * @param {*} link The link object
 * @param {*} dynamicParameters The dynamic parameters
 */
const handleANDGate = async (link, dynamicParameters) => {
  await updateTriggeredLink(link.id, true)
  let allActionsTriggered = true
  link.AREA.Actions.forEach(action => {
    if (
      !action.Action.isEnable ||
      (action.id != link.id && action.triggered == false)
    ) {
      allActionsTriggered = false
      return
    }
  })
  if (allActionsTriggered) {
    callReactions(link.AREA.Reactions, dynamicParameters, link.AREA.User)
    link.AREA.Actions.forEach(action => {
      updateTriggeredLink(action.id, false)
    })
  }
}

/**
 * Handle the OR gate
 * @param {*} link The link object
 * @param {*} dynamicParameters The dynamic parameters
 */
const handleORGate = async (link, dynamicParameters) => {
  await updateTriggeredLink(link.id, true)
  callReactions(link.AREA.Reactions, dynamicParameters, link.AREA.User)
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
      if (
        !link.AREA.isEnable ||
        !checkActionParameters(link.ActionParameters, actionParameters)
      ) {
        return
      }
      if (link.AREA.logicalGate == 'OR') {
        await handleORGate(link, dynamicParameters)
      } else if (link.AREA.logicalGate == 'AND') {
        await handleANDGate(link, dynamicParameters)
      }
    })
  })
}

module.exports = {
  AreaGlue,
  updateTriggeredLink
}
