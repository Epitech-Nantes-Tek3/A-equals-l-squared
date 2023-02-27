'use strict'

const axios = require('axios')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

/**
 * Create a playlist from an area
 * @param {*} Area The Area
 * @param {*} dynamicParameters The dynamic parameters
 * @returns True if the playlist was created, false otherwise
 */
function deezerCreatePlaylistFromArea (Area, dynamicParameters) {
  const reactionParameters = Area.ReactionParameters
  let title = reactionParameters.find(
    parameter => parameter.Parameter.name == 'title'
  ).value
  title = replaceDynamicParameters(title, dynamicParameters)
  return createPlaylist(title, Area.User.deezerId, Area.User.deezerToken)
}

/**
 * Create a playlist
 * @param {*} title The title of the playlist to create
 * @param {*} deezerId The user's Deezer ID
 * @param {*} deezerToken The user's Deezer Token
 * @returns True if the playlist was created, false otherwise
 */
async function createPlaylist (title, deezerId, deezerToken) {
  try {
    const url = `https://api.deezer.com/user/${deezerId}/playlists?title=${title}&access_token=${deezerToken}`
    const response = await axios.post(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    console.error(err.message)
    return false
  }
}

module.exports = { deezerCreatePlaylistFromArea, createPlaylist }
