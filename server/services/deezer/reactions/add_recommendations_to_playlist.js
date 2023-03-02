'use strict'

const axios = require('axios')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')
const { addTracksToPlaylist } = require('../common/add_tracks_to_playlist.js')

/**
 * Add recommendations tracks to a playlist from an area
 * @param {*} Area The Area
 * @param {*} dynamicParameters The dynamic parameters
 * @param {*} User The user
 * @returns True if the tracks were added to the playlist, false otherwise
 */
async function deezerAddRecommendationsToPlaylistFromAreaParameters (
  ReactionParameters,
  dynamicParameters,
  User
) {
  let playlistId = ReactionParameters.find(
    parameter => parameter.Parameter.name == 'playlistId'
  ).value
  playlistId = replaceDynamicParameters(playlistId, dynamicParameters)

  let limit = ReactionParameters.find(
    parameter => parameter.Parameter.name == 'limit'
  ).value
  limit = replaceDynamicParameters(limit, dynamicParameters)
  return addRecommendationsToPlaylist(
    playlistId,
    limit,
    User.deezerId,
    User.deezerToken
  )
}

/**
 * Add the user's recommendations to a playlist
 * @param {*} playlistId The playlist ID to add tracks to
 * @param {*} limit The limit number of tracks to add
 * @param {*} deezerId The user's Deezer ID
 * @param {*} deezerToken The user's Deezer token
 * @returns True if the tracks were added to the playlist, false otherwise
 */
async function addRecommendationsToPlaylist (
  playlistId,
  limit,
  deezerId,
  deezerToken
) {
  try {
    const url = `https://api.deezer.com/user/${deezerId}/recommendations/tracks&access_token=${deezerToken}`
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const tracks = response.data.data
    if (tracks == undefined) {
      console.log('No recommendations')
      return false
    }
    var tracksId = []
    tracks.map(track => tracksId.push(track.id))
    if (limit > 0) tracksId = tracksId.slice(0, limit)
    addTracksToPlaylist(playlistId, tracksId, deezerToken)
    return tracksId
  } catch (err) {
    console.error(err.message)
    return false
  }
}

module.exports = {
  deezerAddRecommendationsToPlaylistFromAreaParameters,
  addRecommendationsToPlaylist
}
