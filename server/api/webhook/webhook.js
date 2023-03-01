'use strict'

module.exports = function (app, passport, database) {
  // Webhook
  app.post('/api/webhook', function (req, res) {
    console.log('Webhook received')
    console.log(req.body)
    res.status(200).send('OK')
  })
}
