const { Strategy, ExtractJwt } = require('passport-jwt')
const passport = require('passport')
require('dotenv').config({ path: '../database.env' })
const database = require('../database_init')

/**
 * Strategy options needed by passport
 */
const options = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

/**
 * Setup a passport strategy option for Bearer Token
 */
passport.use(
  new Strategy(options, async (jwt_payload, done) => {
    try {
      const user = await database.prisma.User.findUnique({
        where: {
          id: jwt_payload.id
        },
        include: { Token: true }
      })
      if (!user.mailVerification) return done(null, null)
      return done(null, user)
    } catch (err) {
      console.error(err.message)
      return done(null, null)
    }
  })
)
