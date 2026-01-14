const dotenv = require('dotenv')
const { Client } = require('pg')
const logger = require('../utils/logger')

dotenv.config()

async function createDatabase() {
  const password = String(process.env.DB_PASSWORD || '')
  console.log('DB_PASSWORD type:', typeof password)
  console.log('DB_PASSWORD value:', password)

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: password,
  })

  try {
    await client.connect()
    logger.info('Connected to PostgreSQL server')

    const result = await client.query("SELECT 1 FROM pg_database WHERE datname = 'birthday_wish'")

    if (result.rows.length === 0) {
      await client.query('CREATE DATABASE birthday_wish')
      logger.info('Database birthday_wish created successfully')
    } else {
      logger.info('Database birthday_wish already exists')
    }
  } catch (error) {
    logger.error('Failed to create database:', error)
    throw error
  } finally {
    await client.end()
  }
}

if (require.main === module) {
  createDatabase().catch(error => {
    console.error('Failed to create database:', error)
    process.exit(1)
  })
}

module.exports = createDatabase
