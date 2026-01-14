const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')

const logger = require('./utils/logger')
const { pool } = require('./database/db')
const { successResponse, serverErrorResponse } = require('./utils/response')

const authRoutes = require('./routes/auth')
const visitRoutes = require('./routes/visits')
const messageRoutes = require('./routes/messages')
const memoryRoutes = require('./routes/memories')
const userRoutes = require('./routes/user')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
})

app.use(helmet())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
)
app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/visits', visitRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/memories', memoryRoutes)
app.use('/api/user', userRoutes)

app.get('/api/health', (req, res) => {
  return successResponse(
    res,
    { status: 'ok', timestamp: new Date().toISOString() },
    'Server is healthy'
  )
})

app.use((err, req, res, next) => {
  logger.error(err.stack)
  return serverErrorResponse(res, err.message || 'Internal Server Error')
})

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV}`)
})

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server')
  await pool.end()
  process.exit(0)
})

module.exports = app
