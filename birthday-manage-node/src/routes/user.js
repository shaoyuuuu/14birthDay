const express = require('express')
const bcrypt = require('bcryptjs')
const { pool } = require('../database/db')
const { authMiddleware, requirePermission } = require('../middleware/auth')
const logger = require('../utils/logger')
const {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
} = require('../utils/response')

const router = express.Router()

router.get('/profile', authMiddleware, requirePermission('profile:view'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM admins WHERE id = $1', [
      req.user.id,
    ])

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'User not found')
    }

    return successResponse(res, { user: result.rows[0] })
  } catch (error) {
    logger.error('Get profile error:', error)
    return serverErrorResponse(res)
  }
})

router.put('/profile', authMiddleware, requirePermission('profile:edit'), async (req, res) => {
  try {
    const { email, username } = req.body
    const userId = req.user.id

    let updateFields = []
    let updateValues = []
    let paramCount = 1

    if (email) {
      updateFields.push(`email = $${paramCount}`)
      updateValues.push(email)
      paramCount++
    }

    if (username) {
      updateFields.push(`username = $${paramCount}`)
      updateValues.push(username)
      paramCount++
    }

    if (updateFields.length === 0) {
      return badRequestResponse(res, 'No fields to update')
    }

    updateValues.push(userId)

    const query = `UPDATE admins SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING id, username, email`
    const result = await pool.query(query, updateValues)

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'User not found')
    }

    logger.info(`User ${userId} profile updated`)

    return successResponse(res, { user: result.rows[0] }, 'Profile updated successfully')
  } catch (error) {
    logger.error('Update profile error:', error)
    return serverErrorResponse(res)
  }
})

router.put('/password', authMiddleware, requirePermission('profile:edit'), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const userId = req.user.id

    const result = await pool.query('SELECT * FROM admins WHERE id = $1', [userId])

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'User not found')
    }

    const user = result.rows[0]
    const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash)

    if (!isValidPassword) {
      return badRequestResponse(res, 'Invalid old password')
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [passwordHash, userId])

    logger.info(`User ${userId} password changed`)

    return successResponse(res, null, 'Password changed successfully')
  } catch (error) {
    logger.error('Change password error:', error)
    return serverErrorResponse(res)
  }
})

module.exports = router
