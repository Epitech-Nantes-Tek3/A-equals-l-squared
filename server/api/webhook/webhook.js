'use strict'

const axios = require('axios')

/**
 * Retry an action if it fails.
 * @param {Promise} action
 * @param {Number} retries
 * @param {Number} delay
 * @returns
 */
function retryAction (action, retries = 3, delay = 3000) {
  return new Promise((resolve, reject) => {
    action()
      .then(resolve)
      .catch(error => {
        if (retries > 0) {
          setTimeout(() => {
            retryAction(action, retries - 1, delay).then(resolve, reject)
          }, delay)
        } else {
          reject(new Error(`Failed after ${retries} retries: ${error.message}`))
        }
      })
  })
}

/**
  * Get the ngrok url.
 * @returns {string} The ngrok url.
 */
function get_ngrok_url () {
  return new Promise((resolve, reject) => {
    axios
      .get('http://ngrok:4040/api/tunnels')
      .then(response => {
        resolve(response.data['tunnels'][0]['public_url'])
      })
      .catch(error => {
        reject(error)
      })
  })
}

module.exports = async function (app, passport, db) {
  let ngrok_url
  try {
    console.log('Starting webhook service...')
    ngrok_url = await retryAction(get_ngrok_url)
    console.log('Webhook service started, the public url is: ', ngrok_url)
  } catch (error) {
    console.log('Webhook service failed to start : ', error.message)
  }

  /**
   * Generate a webhook url for a specific AREAhasActions.
   * @param {String} serviceName
   * @param {String} actionName
   * @param {String} actionLinkId
   * @returns
   */
  const generate_webhook = (serviceName, actionName, actionLinkId) => {
    return (
      ngrok_url +
      '/api/webhook/' +
      serviceName +
      '/' +
      actionName +
      '/' +
      actionLinkId
    )
  }

  /**
   * Generate a webhook url for a specific AREAhasActions.
   * @api {post} /api/webhook/generate Generate a webhook url.
   * @apiParam {string} actionLinkId The AREAhasActions id.
   * @apiSuccess {string} The webhook url.
   * @apiFailure {400} Bad request.
   * @apiFailure {500} Internal server error.
   * @security JWT
   */
  app.post(
    '/api/webhook/generate',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      try {
        if (!('actionLinkId' in req.body) || !req.body.actionLinkId) {
          return res.status(400).send('Bad request')
        }
        const actionLink = await db.prisma.AREAhasActions.findMany({
          where: {
            id: req.body.actionLinkId,
            AREA: {
              userId: req.user.id
            }
          },
          select: {
            Action: {
              select: {
                name: true,
                needWebhook: true,
                Service: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        })

        if (actionLink.length === 0 || !actionLink[0].Action.needWebhook) {
          return res.status(400).send('Bad request')
        }
        console.log('actionLinkId', req.body.actionLinkId)
        const webhook = generate_webhook(
          actionLink[0].Action.Service.name,
          actionLink[0].Action.name,
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
      console.log('Webhooks error', error)
    }
    res.status(200).send('OK')
  })
}
