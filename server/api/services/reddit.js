'use strict'

const axios = require('axios')

module.exports = function(app, passport, database) {
  /**
   * Generate token thanks to a code in Reddit
   * body.code -> Code given by Reddit
   * Route protected by a JWT token
   */
  app.post(
      '/api/code/reddit', passport.authenticate('jwt', {session: false}),
      async (req, res, next) => {
        if (!req.user) return res.status(401).send('Invalid code')
          try {
            const postData = {
              grant_type: 'authorization_code',
              code: req.body.code,
              redirect_uri: 'http://localhost:8081/auth.html'
            }
            const authString = process.env.REDDIT_AUTH
            const authHeader =
                `Basic ${Buffer.from(authString).toString('base64')}`

            const ret =
                await axios
                    .post(
                        'https://www.reddit.com/api/v1/access_token', postData,
                        {
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            Authorization: authHeader,
                            'User-Agent': 'MyBot/1.0.0'
                          }
                        })
                        await database.prisma.User.update({
                            where: {id: req.user.id},
                            data: {redditRefreshToken: ret.data.refresh_token}
                    })
            return res.status(200).json({
              status: 'success',
              data: {access_token: ret.data.access_token},
              statusCode: res.statusCode
            })
          } catch (err) {
            console.log(err)
            return res.status(400).send('Code generation has failed.')
          }
      })
}