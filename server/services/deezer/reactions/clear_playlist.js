'use strict'

const axios = require('axios')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

/**
 * Clear a playlist from an area
 * @param {*} Area The Area
 * @param {*} dynamicParameters The dynamic parameters
 * @param {*} User The user
 * @returns True if the tracks were cleared in the playlist, false otherwise
 */
function deezerClearPlaylistFromAreaParameters (
  ReactionParameters,
  dynamicParameters,
  User
) {
  let playlistId = ReactionParameters.find(
    parameter => parameter.Parameter.name == 'playlistId'
  ).value
  playlistId = replaceDynamicParameters(playlistId, dynamicParameters)
  return clearPlaylist(playlistId, User.deezerToken)
}

/**
 * Clear a playlist
 * @param {*} playlistId The playlist ID to clear
 * @param {*} deezerToken The user's Deezer token
 * @returns True if the tracks were cleared in the playlist, false otherwise
 */
async function clearPlaylist (playlistId, deezerToken) {
  try {
    var url = `https://api.deezer.com/playlist/${playlistId}&access_token=${deezerToken}`
    var response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const tracks = response.data.tracks.data
    const tracksId = []
    tracks.map(track => tracksId.push(track.id))
    url = `https://api.deezer.com/playlist/${playlistId}/tracks&songs=${tracksId.join(
      '%2C'
    )}&request_method=DELETE&access_token=${deezerToken}`
    response = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    console.error(err.message)
    return false
  }
}

module.exports = { deezerClearPlaylistFromAreaParameters, clearPlaylist }
