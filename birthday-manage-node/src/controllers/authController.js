const express = require('express')
const { AuthService } = require('../services')
const { registerSchema, loginSchema, validate } = require('../validators')
const { successResponse } = require('../utils/response')

const router = express.Router()
const authService = new AuthService()

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body)
    return successResponse(res, result, 'User registered successfully')
  } catch (error) {
    next(error)
  }
})

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    return successResponse(res, result, 'Login successful')
  } catch (error) {
    next(error)
  }
})

module.exports = router
