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

  const generate_webhook = (userId, serviceName, actionName, actionLinkId) => {
    return (
      ngrok_url +
      '/api/webhook/' +
      userId +
      '/' +
      serviceName +
      '/' +
      actionName +
      '/' +
      actionLinkId)
  }

  app.post(
    '/api/webhook/generate',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        console.log('New webhook generator call.')
        if (
          !('userId' in req.body) ||
          !req.body.userId ||
          !('actionLinkId' in req.body) ||
          !req.body.actionLinkId
        ) {
          return res.status(400).send('Bad request')
        }
        const actionLink = await db.prisma.AREAhasActions.findMany({
          where: {
            id: req.body.actionLinkId
          },
          select: {
            Action: {
              select: {
                name: true,
                Service: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        })
        if (actionLink.length === 0) {
          return res.status(400).send('Bad request')
        }
        const webhook = generate_webhook(
          req.body.userId,
          actionLink.Action.Service.name,
          actionLink.Action.name,
          req.body.actionLinkId
        )
        return res.status(200).send(webhook)
      } catch (error) {
        console.log('Webhooks generator error', error)
        return res.status(500).send('Internal server error')
      }
    }
  )

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
