'use strict'

const axios = require('axios')

async function addTracksToPlaylist (playlistId, tracksId, deezerToken) {
  try {
    const url = `https://api.deezer.com/playlist/${playlistId}/tracks&songs=${tracksId.join(
      '%2C'
    )}&request_method=POST&access_token=${deezerToken}`
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return true
  } catch (err) {
    console.error(err.message)
    return false
  }
}

module.exports = { addTracksToPlaylist }
