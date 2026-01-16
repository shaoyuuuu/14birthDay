const express = require('express')
const { AuthService } = require('../services')
const { registerSchema, loginSchema, validate } = require('../validators')
const { successResponse } = require('../utils/response')
const { authMiddleware } = require('../middleware/auth')

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

router.get('/verify', authMiddleware, async (req, res, next) => {
  try {
    return successResponse(res, { user: req.user }, 'Token verified successfully')
  } catch (error) {
    next(error)
  }
})

router.post('/logout', authMiddleware, async (req, res, next) => {
  try {
    return successResponse(res, null, 'Logout successful')
  } catch (error) {
    next(error)
  }
})

module.exports = router
