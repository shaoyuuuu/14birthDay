import type { ApiResponse } from '@/types'

export class ApiError extends Error {
  public code: string
  public errors?: Array<{ field: string; message: string }>

  constructor(message: string, code: string = 'API_ERROR', errors?: Array<{ field: string; message: string }>) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.errors = errors
  }
}

export class ValidationError extends ApiError {
  constructor(errors: Array<{ field: string; message: string }>) {
    super('Validation failed', 'VALIDATION_ERROR', errors)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource already exists') {
    super(message, 'CONFLICT')
    this.name = 'ConflictError'
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error instanceof ApiError) {
    return error
  }

  if (error.response?.data) {
    const { data } = error.response
    
    if (data.error) {
      const errorCode = data.error.code
      const errorMessage = data.error.message
      
      if (errorCode === 'VALIDATION_ERROR' && data.error.errors) {
        return new ValidationError(data.error.errors)
      }
      if (errorCode === 'UNAUTHORIZED') {
        return new UnauthorizedError(errorMessage)
      }
      if (errorCode === 'FORBIDDEN') {
        return new ForbiddenError(errorMessage)
      }
      if (errorCode === 'NOT_FOUND') {
        return new NotFoundError(errorMessage)
      }
      if (errorCode === 'CONFLICT') {
        return new ConflictError(errorMessage)
      }
      return new ApiError(errorMessage || data.message, errorCode, data.error.errors)
    }
    
    if (data.success === false && data.message) {
      return new ApiError(data.message, 'API_ERROR')
    }
  }

  return new ApiError(error.message || 'An unexpected error occurred')
}
