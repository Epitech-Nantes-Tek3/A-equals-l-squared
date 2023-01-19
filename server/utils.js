const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: 'database.env' })

const hash = async password => {
  const salt = await bcrypt.genSalt(10)
  password = await bcrypt.hash(password, salt)
  return password
}

const compare = async (hash, pass) => {
  return bcrypt.compare(hash, pass)
}

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRE)
  })
}

module.exports = {
  hash,
  compare,
  generateToken
}
