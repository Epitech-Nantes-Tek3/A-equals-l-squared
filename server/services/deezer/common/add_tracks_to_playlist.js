'use strict'

const axios = require('axios')

/**
 * Add tracks (by their IDs) to a playlist
 * @param {*} playlistId The playlist ID to add tracks to
 * @param {*} tracksId The tracks IDs to add to the playlist
 * @param {*} deezerToken The user's Deezer token
 * @returns True if the tracks were added to the playlist, false otherwise
 */
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
