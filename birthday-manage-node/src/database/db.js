const dotenv = require('dotenv')
const { Pool } = require('pg')
const logger = require('../utils/logger')

dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'birthday_wish',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
})

pool.on('connect', () => {
  logger.info('Database connected successfully')
})

pool.on('error', err => {
  logger.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = { pool }
