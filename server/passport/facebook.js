var FacebookStrategy = require('passport-facebook').Strategy
require('dotenv').config({ path: '../../.env' })
const passport = require('passport')
const database = require('../database_init')
const { hash, compare } = require('../utils')

/**
 * Strategy options needed by passport
 * CallBackUrl will be updated when a real domain will be available.
 */
const options = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/api/login/facebookCallBack',
  profileFields: ['id', 'emails', 'name'],
  passReqToCallback: true
}

/**
 * Setup a passport strategy option for Facebook auth
 */
passport.use(
  new FacebookStrategy(
    options,
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = await database.prisma.user.findUnique({
          where: { facebookId: profile.id }
        })
        if (user) return done(null, user)
        const oldUser = await database.prisma.user.findUnique({
          where: { email: profile.emails[0].value }
        })
        if (oldUser) {
          const newUser = await database.prisma.user.update({
            where: { email: profile.emails[0].value },
            data: { facebookId: profile.id }
          })
          return done(null, newUser)
        }
        const newUser = await database.prisma.user.create({
          data: {
            username: profile.name.givenName,
            email: profile.emails[0].value,
            facebookId: profile.id,
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
    }
  )
)
