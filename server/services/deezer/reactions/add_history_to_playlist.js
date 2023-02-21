'use strict'

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')
const { addTracksToPlaylist } = require('../common/add_tracks_to_playlist.js')

async function deezerAddHistoryToPlaylistFromArea (Area, dynamicParameters) {
  const reactionParameters = Area.ReactionParameters
  let playlistId = reactionParameters.find(
    parameter => parameter.Parameter.name == 'playlistId'
  ).value
  playlistId = replaceDynamicParameters(playlistId, dynamicParameters)
  return addHistoryToPlaylist(playlistId, Area.User.deezerToken)
}

async function addHistoryToPlaylist (playlistId, deezerId, deezerToken) {
  try {
    const url = `https://api.deezer.com/user/${deezerId}/history&access_token=${deezerToken}`
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const tracks = response.data.data
    const tracksId = []
    tracks.map(track => tracksId.push(track.id))
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
