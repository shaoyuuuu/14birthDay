function successResponse(res, data = null, message = 'Success') {
  return res.status(200).json({
    success: true,
    data,
    message,
  })
}

function createdResponse(res, data = null, message = 'Created successfully') {
  return res.status(201).json({
    success: true,
    data,
    message,
  })
}

function noContentResponse(res, message = 'No content') {
  return res.status(204).json({
    success: true,
    data: null,
    message,
  })
}

function badRequestResponse(res, message = 'Bad request', errors = null) {
  const response = {
    success: false,
    error: {
      message,
      code: 'BAD_REQUEST',
    },
  }

  if (errors) {
    response.error.errors = errors
  }

  return res.status(400).json(response)
}

function unauthorizedResponse(res, message = 'Unauthorized') {
  return res.status(401).json({
    success: false,
    error: {
      message,
      code: 'UNAUTHORIZED',
    },
  })
}

function forbiddenResponse(res, message = 'Forbidden') {
  return res.status(403).json({
    success: false,
    error: {
      message,
      code: 'FORBIDDEN',
    },
  })
}

function notFoundResponse(res, message = 'Not found') {
  return res.status(404).json({
    success: false,
    error: {
      message,
      code: 'NOT_FOUND',
    },
  })
}

function conflictResponse(res, message = 'Conflict') {
  return res.status(409).json({
    success: false,
    error: {
      message,
      code: 'CONFLICT',
    },
  })
}

function validationErrorResponse(res, errors) {
  return res.status(400).json({
    success: false,
    error: {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors,
    },
  })
}

function serverErrorResponse(res, message = 'Internal server error') {
  return res.status(500).json({
    success: false,
    error: {
      message,
      code: 'INTERNAL_SERVER_ERROR',
    },
  })
}

function serviceUnavailableResponse(res, message = 'Service unavailable') {
  return res.status(503).json({
    success: false,
    error: {
      message,
      code: 'SERVICE_UNAVAILABLE',
    },
  })
}

module.exports = {
  successResponse,
  createdResponse,
  noContentResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  validationErrorResponse,
  serverErrorResponse,
  serviceUnavailableResponse,
}
