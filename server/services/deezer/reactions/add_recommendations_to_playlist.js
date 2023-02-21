'use strict'

const axios = require('axios')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')
const { addTracksToPlaylist } = require('../common/add_tracks_to_playlist.js')

async function deezerAddRecommendationsToPlaylistFromArea (
  Area,
  dynamicParameters
) {
  const reactionParameters = Area.ReactionParameters
  let playlistId = reactionParameters.find(
    parameter => parameter.Parameter.name == 'playlistId'
  ).value
  playlistId = replaceDynamicParameters(playlistId, dynamicParameters)
  return addRecommendationsToPlaylist(
    playlistId,
    Area.User.deezerId,
    Area.User.deezerToken
  )
}

async function addRecommendationsToPlaylist (playlistId, deezerId, deezerToken) {
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
  deezerAddRecommendationsToPlaylistFromArea,
  addRecommendationsToPlaylist
}
