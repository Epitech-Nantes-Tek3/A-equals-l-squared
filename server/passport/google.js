var GoogleStrategy = require('passport-google-oidc')
require('dotenv').config({ path: '../database.env' })
const passport = require('passport')
const database = require('../database_init')
const { hash, compare } = require('../utils')

const options = {
  clientID: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/api/login/googleCallBack',
  passReqToCallback: true
}

passport.use(
  new GoogleStrategy(
    options,
    async (request, accessToken, profile, done) => {
      try {
        const user = await database.prisma.user.findUnique({
          where: { googleId: profile.id }
        })
        if (user) return done(null, user)
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
    }
  )
)
