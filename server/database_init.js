const mysql = require('mysql')
require('dotenv').config({ path: 'database.env' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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
