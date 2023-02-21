'use strict'

const axios = require('axios')

async function getUserPlaylists (ownedByUser, deezerId, deezerToken) {
  var url = `https://api.deezer.com/user/${deezerId}/playlists&access_token=${deezerToken}`
  var response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = response.data.data
  const playlists = []
  data.map(playlist => {
    if (ownedByUser == 'true') {
      if (playlist.creator.id == deezerId)
        playlists.push({ id: playlist.id, name: playlist.title })
    } else playlists.push({ id: playlist.id, name: playlist.title })
  })
  return playlists
}

module.exports = getUserPlaylists
