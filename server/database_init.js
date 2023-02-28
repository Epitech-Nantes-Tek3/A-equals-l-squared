const mysql = require('mysql')
require('dotenv').config({ path: '../.env' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Connect to the MY_SQL database
 */
const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
})

module.exports = {
  prisma,
  connection
}
