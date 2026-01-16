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
      if (data.error.code === 'VALIDATION_ERROR' && data.error.errors) {
        return new ValidationError(data.error.errors)
      }
      return new ApiError(data.error.message, data.error.code, data.error.errors)
    }
  }

  return new ApiError(error.message || 'An unexpected error occurred')
}
