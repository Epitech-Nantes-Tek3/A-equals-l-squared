'use strict'

const axios = require('axios')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

/**
 * Delete a playlist from an area
 * @param {*} Area The Area
 * @param {*} dynamicParameters The dynamic parameters
 * @param {*} User The user
 * @returns True if the playlist was deleted, false otherwise
 */
function deezerDeletePlaylistFromAreaParameters (
  ReactionParameters,
  dynamicParameters,
  User
) {
  let playlistId = ReactionParameters.find(
    parameter => parameter.Parameter.name == 'playlistId'
  ).value
  playlistId = replaceDynamicParameters(playlistId, dynamicParameters)
  return deletePlaylist(playlistId, User.deezerToken)
}

/**
 * Delete a playlist
 * @param {*} playlistId The playlist ID to delete
 * @param {*} deezerToken The user's Deezer token
 * @returns True if the playlist was deleted, false otherwise
 */
async function deletePlaylist (playlistId, deezerToken) {
  try {
    const url = `https://api.deezer.com/playlist/${playlistId}&access_token=${deezerToken}`
    const response_post = await axios.delete(url)
  } catch (err) {
    console.error(err.message)
    return false
  }
}

module.exports = { deezerDeletePlaylistFromAreaParameters, deletePlaylist }
