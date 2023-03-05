const { Strategy } = require('passport-local')
const { hash, compare } = require('../utils')
const passport = require('passport')
const database = require('../database_init')
require('dotenv').config({ path: '../../.env' })

/**
 * Strategy option needed by passport
 */
const options = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}

/**
 * Setup a passport strategy option for Signup
 */
passport.use(
  'signup',
  new Strategy(options, async (req, email, password, cb) => {
    try {
      const existsEmail = await database.prisma.User.findFirst({
        where: { email }
      })
      if (existsEmail && existsEmail.mailVerification) {
        return cb(null, false, {
          message: 'Email already exists.',
          statusCode: 400
        })
      }
      if (existsEmail) {
        return cb(null, existsEmail)
      }
      const user = await database.prisma.User.create({
        data: {
          username: req.body.username,
          email: email,
          password: await hash(password),
          isAdmin: false
        }
      })
      return cb(null, user)
    } catch (err) {
      console.error(err.message)
      return cb(null, err)
    }
  })
)

options.passReqToCallback = false

/**
 * Setup a passport strategy option for Login
 */
passport.use(
  'login',
  new Strategy(options, async (email, password, cb) => {
    try {
      const user = await database.prisma.User.findFirst({
        where: { email }
      })
      if (!user)
        return cb(null, false, {
          message: 'No user found.',
          statusCode: 400
        })
      const validPassword = await compare(password, user.password)
      if (!validPassword)
        return cb(null, false, {
          message: 'Invalid credentials.',
          statusCode: 401
        })
      if (!user.mailVerification)
        return cb(null, false, {
          message: 'Please verifiy your e-mail address.',
          statusCode: 401
        })
      return cb(null, user)
    } catch (err) {
      console.error(err.message)
      return cb(null, err)
    }
  })
)
