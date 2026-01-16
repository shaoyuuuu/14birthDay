const { AppError } = require('../utils/errors')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  error.statusCode = err.statusCode || 500

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = new AppError(message, 400, 'VALIDATION_ERROR')
  }

  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = new AppError(message, 404, 'NOT_FOUND')
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new AppError(message, 400, 'DUPLICATE_FIELD')
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    error = new AppError(message, 401, 'INVALID_TOKEN')
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired'
    error = new AppError(message, 401, 'TOKEN_EXPIRED')
  }

  if (err.code === '23505') {
    const message = 'Duplicate entry'
    error = new AppError(message, 409, 'DUPLICATE_ENTRY')
  }

  if (err.code === '23503') {
    const message = 'Foreign key constraint failed'
    error = new AppError(message, 400, 'FOREIGN_KEY_ERROR')
  }

  const response = {
    success: false,
    error: {
      message: error.message,
      code: error.code || 'INTERNAL_ERROR',
    },
  }

  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack
  }

  res.status(error.statusCode).json(response)
}

const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND')
  next(error)
}

module.exports = {
  errorHandler,
  notFoundHandler,
}
