const mysql = require('mysql')
require('dotenv').config({ path: 'database.env' })
const { PrismaClient } = require('@prisma/client')
const { createGmailService } = require('./services/gmail/gmail_init')
const { createDiscordService } = require('./services/discord/init')
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

createGmailService();
createDiscordService();

/// Add here database operation needed for development testing

module.exports = {
  prisma,
  connection
}
