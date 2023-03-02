'use strict'

const axios = require('axios')

function get_ngrok_url () {
  try {
    axios
      .get('http://ngrok:4040/api/tunnels')
      .then(response => {
        return response.data['tunnels'][0]['public_url']
      })
      .catch(error => {
        console.error('4040/api/tunnels data', error)
      })
  } catch (error) {
    console.log('get URL error', error)
  }
}

module.exports = function (app, passport, db) {
  const ngrok_url = get_ngrok_url()


  app.post('/api/webhook', function (req, res) {
    try {
      console.log('Webhook received new function call.')
      console.log(req.body)
      console.log('My ngrok url is: ', ngrok_url)
    } catch (error) {
      console.log('Weebhooks error', error)
    }
    res.status(200).send('OK')
  })
}
