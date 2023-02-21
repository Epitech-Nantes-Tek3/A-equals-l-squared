'use strict'

const axios = require('axios')

const { replaceDynamicParameters } = require('../../glue/dynamic_parameters.js')

function deezerCreatePlaylistFromArea (Area, dynamicParameters) {
  console.log('First function called')
  const reactionParameters = Area.ReactionParameters
  let title = reactionParameters.find(
    parameter => parameter.Parameter.name == 'title'
  ).value
  title = replaceDynamicParameters(title, dynamicParameters)
  console.log('Title: ' + title)
  return createPlaylist(title, Area.User.deezerId, Area.User.deezerToken)
}

async function createPlaylist (title, deezerId, deezerToken) {
  try {
    const url = `https://api.deezer.com/user/${deezerId}/playlists?title=${title}&access_token=${deezerToken}`
    const response = await axios.post(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(response.data)
  } catch (err) {
    console.error(err.message)
    return false
  }
}

module.exports = { deezerCreatePlaylistFromArea, createPlaylist }
