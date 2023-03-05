var GoogleStrategy = require('passport-google-oidc')
require('dotenv').config({ path: '../../.env' })
const passport = require('passport')
const database = require('../database_init')
const { hash, compare } = require('../utils')

/**
 * Strategy options needed by passport
 * CallBackUrl will be updated when a real domain will be available.
 */
const options = {
  clientID: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/api/login/googleCallBack',
  passReqToCallback: true
}

/**
 * Setup a passport strategy option for Google auth
 */
passport.use(
  new GoogleStrategy(options, async (request, accessToken, profile, done) => {
    try {
      const user = await database.prisma.user.findUnique({
        where: { googleId: profile.id }
      })
      if (user) return done(null, user)
      const oldUser = await database.prisma.user.findUnique({
        where: { email: profile.emails[0].value }
      })
      if (oldUser) {
        const newUser = await database.prisma.user.update({
          where: { email: profile.emails[0].value },
          data: { googleId: profile.id }
        })
        return done(null, newUser)
      }
      const newUser = await database.prisma.user.create({
        data: {
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          password: await hash(profile.id),
          isAdmin: false,
          mailVerification: true
        }
      })
      return done(null, newUser)
    } catch (err) {
      console.error(err.message)
      return done(err, false)
    }
  })
)
