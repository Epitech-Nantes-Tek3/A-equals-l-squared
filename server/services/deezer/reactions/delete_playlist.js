'use strict'

const axios = require('axios')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

function deezerDeletePlaylistFromArea (Area, dynamicParameters) {
  const reactionParameters = Area.ReactionParameters
  let playlistId = reactionParameters.find(
    parameter => parameter.Parameter.name == 'playlistId'
  ).value
  playlistId = replaceDynamicParameters(playlistId, dynamicParameters)
  return createPlaylist(playlistId, Area.User.deezerToken)
}

async function deletePlaylist (playlistId, deezerToken) {
  try {
    const url = `https://api.deezer.com/playlist/${playlistId}&access_token=${deezerToken}`
    const response_post = await axios.delete(url)
  } catch (err) {
    console.error(err.message)
    return false
  }
}

module.exports = { deezerDeletePlaylistFromArea, deletePlaylist }
