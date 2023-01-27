var FacebookStrategy = require('passport-facebook').Strategy
require('dotenv').config({ path: '../database.env' })
const passport = require('passport')
const database = require('../database_init')
const { hash, compare } = require('../utils')

const options = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/api/login/facebookCallBack',
  profileFields: ['id', 'emails', 'name'],
  passReqToCallback: true
}

passport.use(
  new FacebookStrategy(
    options,
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = await database.prisma.user.findUnique({
          where: { facebookId: profile.id }
        })
        if (user) return done(null, user)
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
