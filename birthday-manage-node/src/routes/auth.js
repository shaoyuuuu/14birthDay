const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool } = require('../database/db')
const { authMiddleware, getUserPermissions } = require('../middleware/auth')
const { registerSchema, loginSchema, validate } = require('../utils/validation')
const { logger } = require('../utils/logger')
const {
  successResponse,
  createdResponse,
  badRequestResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} = require('../utils/response')

const router = express.Router()

router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await pool.query(
      'SELECT id FROM admins WHERE username = $1 OR email = $2',
      [username, email]
    )

    if (existingUser.rows.length > 0) {
      return badRequestResponse(res, 'Username or email already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const roleResult = await pool.query("SELECT id FROM roles WHERE name = 'admin'")
    const roleId = roleResult.rows.length > 0 ? roleResult.rows[0].id : null

    const result = await pool.query(
      'INSERT INTO admins (username, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role_id',
      [username, email, passwordHash, roleId]
    )

    const token = jwt.sign(
      { id: result.rows[0].id, username: result.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    const userResult = await pool.query(
      `SELECT a.id, a.username, a.email, r.name as role_name
       FROM admins a
       LEFT JOIN roles r ON a.role_id = r.id
       WHERE a.id = $1`,
      [result.rows[0].id]
    )

    const permissions = await getUserPermissions(result.rows[0].id)

    logger.info(`New admin registered: ${username}`)

    return createdResponse(
      res,
      {
        token,
        user: {
          id: userResult.rows[0].id,
          username: userResult.rows[0].username,
          email: userResult.rows[0].email,
          role: userResult.rows[0].role_name,
          permissions: permissions.map(p => p.name),
        },
      },
      'Admin registered successfully'
    )
  } catch (error) {
    logger.error('Register error:', error)
    return serverErrorResponse(res)
  }
})

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { username, password } = req.body

    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username])

    if (result.rows.length === 0) {
      return unauthorizedResponse(res, 'Invalid credentials')
    }

    const user = result.rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return unauthorizedResponse(res, 'Invalid credentials')
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    const userResult = await pool.query(
      `SELECT a.id, a.username, a.email, r.name as role_name
       FROM admins a
       LEFT JOIN roles r ON a.role_id = r.id
       WHERE a.id = $1`,
      [user.id]
    )

    const permissions = await getUserPermissions(user.id)

    logger.info(`Admin logged in: ${username}`)

    return successResponse(
      res,
      {
        token,
        user: {
          id: userResult.rows[0].id,
          username: userResult.rows[0].username,
          email: userResult.rows[0].email,
          role: userResult.rows[0].role_name,
          permissions: permissions.map(p => p.name),
        },
      },
      'Login successful'
    )
  } catch (error) {
    logger.error('Login error:', error)
    return serverErrorResponse(res)
  }
})

router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.username, a.email, r.name as role_name
       FROM admins a
       LEFT JOIN roles r ON a.role_id = r.id
       WHERE a.id = $1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'User not found')
    }

    const permissions = await getUserPermissions(req.user.id)

    return successResponse(res, {
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        role: result.rows[0].role_name,
        permissions: permissions.map(p => p.name),
      },
    })
  } catch (error) {
    logger.error('Verify error:', error)
    return serverErrorResponse(res)
  }
})

module.exports = router
