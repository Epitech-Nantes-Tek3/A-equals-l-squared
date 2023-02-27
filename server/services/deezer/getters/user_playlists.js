'use strict'

const axios = require('axios')

/**
 * Get the user's playlists
 * @param {*} deezerId The user's Deezer ID
 * @param {*} deezerToken The user's Deezer token
 * @returns The user's playlists
 */
async function getUserPlaylists (deezerId, deezerToken) {
  var url = `https://api.deezer.com/user/${deezerId}/playlists&access_token=${deezerToken}`
  var response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = response.data.data
  const playlists = []
  data.map(playlist => {
    if (playlist.creator.id == deezerId)
      playlists.push({ id: playlist.id.toString(), name: playlist.title })
  })
  return playlists
}

module.exports = getUserPlaylists
