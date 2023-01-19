const { Strategy, ExtractJwt } = require('passport-jwt')
const passport = require('passport')
require('dotenv').config({ path: '../database.env' })
const database = require('../database_init')

const options = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

passport.use(
  new Strategy(options, async function (jwt_payload, done) {
    try {
      const user = await database.prisma.user.findUnique({
        where: {
          id: Number(jwt_payload.id)
        }
      })
      return done(null, user)
    } catch (err) {
      console.error(err.message)
      return done(null, null)
    }
  })
)
