const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const config = require('./config')
const { logger } = require('./utils/logger')
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler')
const { requestMiddleware, performanceMiddleware } = require('./middleware/logging')
const { metricsMiddleware } = require('./utils/metrics')
const { pool } = require('./database/db')
const { swaggerServe, swaggerSetup } = require('./config/swagger')

const { authController, usersController } = require('./controllers')
const { authMiddleware } = require('./middleware/auth')

const visitRoutes = require('./routes/visits')
const messageRoutes = require('./routes/messages')
const memoryRoutes = require('./routes/memories')
const userRoutes = require('./routes/user')
const usersRoutes = require('./routes/users')
const rolesRoutes = require('./routes/roles')

const app = express()

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(
  helmet({
    contentSecurityPolicy: config.env === 'production' ? undefined : false,
  })
)

app.use(cors(config.cors))

app.use(limiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(requestMiddleware)
app.use(performanceMiddleware)
app.use(metricsMiddleware)

app.use('/api/auth', authController)
app.use('/api/users', usersController)
app.use('/api/roles', rolesRoutes)
app.use('/api/visits', visitRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/memories', memoryRoutes)
app.use('/api/user', userRoutes)

if (config.env !== 'production') {
  app.use('/api-docs', swaggerServe, swaggerSetup)
  logger.info('Swagger documentation available at /api-docs')
}

app.use('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.env,
      version: '1.0.0',
    },
    message: 'Server is healthy',
  })
})

app.use(notFoundHandler)

app.use(errorHandler)

const server = app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`)
  logger.info(`Environment: ${config.env}`)
  logger.info(`Health check: http://localhost:${config.port}/api/health`)
})

const gracefulShutdown = async signal => {
  logger.info(`${signal} signal received: closing HTTP server`)

  server.close(async () => {
    logger.info('HTTP server closed')

    try {
      await pool.end()
      logger.info('Database connection pool closed')
      process.exit(0)
    } catch (error) {
      logger.error('Error during database pool closure:', error)
      process.exit(1)
    }
  })

  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error)
  gracefulShutdown('uncaughtException')
})

module.exports = app
