const winston = require('winston')
const path = require('path')
const fs = require('fs')

const logsDir = path.join(__dirname, '../../logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
)

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`
    }
    return msg
  })
)

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'birthday-manage-api' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
      silent: process.env.NODE_ENV === 'test',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
})

class RequestLogger {
  constructor() {
    this.requests = new Map()
  }

  logRequest(req) {
    const requestId = req.id || Date.now().toString()
    req.requestId = requestId
    
    this.requests.set(requestId, {
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      startTime: Date.now(),
    })

    logger.info('Incoming request', {
      requestId,
      method: req.method,
      path: req.path,
      ip: req.ip,
    })

    return requestId
  }

  logResponse(req, res, requestId) {
    const request = this.requests.get(requestId)
    if (!request) return

    const duration = Date.now() - request.startTime

    logger.info('Request completed', {
      requestId,
      method: request.method,
      path: request.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    })

    this.requests.delete(requestId)
  }

  logError(req, error, requestId) {
    const request = this.requests.get(requestId)
    
    logger.error('Request failed', {
      requestId,
      method: request?.method,
      path: request?.path,
      error: error.message,
      stack: error.stack,
    })

    if (requestId) {
      this.requests.delete(requestId)
    }
  }
}

const requestLogger = new RequestLogger()

const createRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

module.exports = {
  logger,
  requestLogger,
  createRequestId,
}
