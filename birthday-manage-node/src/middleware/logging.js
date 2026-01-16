const { logger, requestLogger, createRequestId } = require('../utils/logger')

const requestMiddleware = (req, res, next) => {
  req.id = createRequestId()
  req.startTime = Date.now()

  const requestId = requestLogger.logRequest(req)

  res.on('finish', () => {
    requestLogger.logResponse(req, res, requestId)
  })

  next()
}

const performanceMiddleware = (req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const { method, path } = req
    const { statusCode } = res

    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method,
        path,
        statusCode,
        duration: `${duration}ms`,
      })
    }
  })

  next()
}

module.exports = {
  requestMiddleware,
  performanceMiddleware,
}
