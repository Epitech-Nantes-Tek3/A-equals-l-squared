'use strict'

const axios = require('axios')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')
const { addTracksToPlaylist } = require('../common/add_tracks_to_playlist.js')

/**
 * Add history tracks to a playlist from an area
 * @param {*} Area The Area
 * @param {*} dynamicParameters The dynamic parameters
 * @returns True if the tracks were added to the playlist, false otherwise
 */
async function deezerAddHistoryToPlaylistFromArea (Area, dynamicParameters) {
  const reactionParameters = Area.ReactionParameters
  let playlistId = reactionParameters.find(
    parameter => parameter.Parameter.name == 'playlistId'
  ).value
  playlistId = replaceDynamicParameters(playlistId, dynamicParameters)

  let limit = reactionParameters.find(
    parameter => parameter.Parameter.name == 'limit'
  ).value
  limit = replaceDynamicParameters(limit, dynamicParameters)
  return addHistoryToPlaylist(
    playlistId,
    limit,
    Area.User.deezerId,
    Area.User.deezerToken
  )
}

/**
 * Add the user's history to a playlist
 * @param {*} playlistId The playlist ID to add tracks to
 * @param {*} limit The limit number of tracks to add
 * @param {*} deezerId The user's Deezer ID
 * @param {*} deezerToken The user's Deezer token
 * @returns True if the tracks were added to the playlist, false otherwise
 */
async function addHistoryToPlaylist (playlistId, limit, deezerId, deezerToken) {
  try {
    const url = `https://api.deezer.com/user/${deezerId}/history&access_token=${deezerToken}`
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const tracks = response.data.data
    if (tracks == undefined) {
      console.log('No history')
      return false
    }
    const tracksId = []
    tracks.map(track => tracksId.push(track.id))
    tracksId = tracksId.slice(0, limit)
    addTracksToPlaylist(playlistId, tracksId, deezerToken)
    return tracksId
  } catch (err) {
    console.error(err.message)
    return false
  }
}

module.exports = {
  deezerAddHistoryToPlaylistFromArea,
  addHistoryToPlaylist
}
