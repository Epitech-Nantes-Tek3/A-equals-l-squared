'use strict'

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

function deezerClearPlaylistFromArea (Area, dynamicParameters) {
  const reactionParameters = Area.ReactionParameters
  let playlistId = reactionParameters.find(
    parameter => parameter.Parameter.name == 'playlistId'
  ).value
  playlistId = replaceDynamicParameters(playlistId, dynamicParameters)
  return clearPlaylist(playlistId, Area.User.deezerToken)
}

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

module.exports = { deezerClearPlaylistFromArea, clearPlaylist }
