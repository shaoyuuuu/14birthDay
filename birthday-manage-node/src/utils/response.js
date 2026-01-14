function successResponse(res, data = null, message = 'Success') {
  return res.status(200).json({
    code: 200,
    message,
    data
  })
}

function createdResponse(res, data = null, message = 'Created successfully') {
  return res.status(201).json({
    code: 201,
    message,
    data
  })
}

function badRequestResponse(res, message = 'Bad request', error = null) {
  return res.status(400).json({
    code: 400,
    message,
    error
  })
}

function unauthorizedResponse(res, message = 'Unauthorized') {
  return res.status(401).json({
    code: 401,
    message
  })
}

function forbiddenResponse(res, message = 'Forbidden') {
  return res.status(403).json({
    code: 403,
    message
  })
}

function notFoundResponse(res, message = 'Not found') {
  return res.status(404).json({
    code: 404,
    message
  })
}

function conflictResponse(res, message = 'Conflict') {
  return res.status(409).json({
    code: 409,
    message
  })
}

function serverErrorResponse(res, message = 'Internal server error', error = null) {
  return res.status(500).json({
    code: 500,
    message,
    error
  })
}

module.exports = {
  successResponse,
  createdResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  serverErrorResponse
}
