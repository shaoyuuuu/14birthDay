const express = require('express')
const { pool } = require('../database/db')
const { authMiddleware, requirePermission } = require('../middleware/auth')
const { messageSchema, validate } = require('../utils/validation')
const logger = require('../utils/logger')
const {
  successResponse,
  createdResponse,
  notFoundResponse,
  serverErrorResponse,
} = require('../utils/response')

const router = express.Router()

router.post('/', validate(messageSchema), async (req, res) => {
  try {
    const { name, email, message } = req.body

    const result = await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    )

    logger.info(`New message from ${name}`)

    return createdResponse(res, { message: result.rows[0] }, 'Message submitted successfully')
  } catch (error) {
    logger.error('Submit message error:', error)
    return serverErrorResponse(res)
  }
})

router.get('/', authMiddleware, requirePermission('messages:view'), async (req, res) => {
  try {
    const { approved, limit = 50, offset = 0 } = req.query

    let query = 'SELECT * FROM messages WHERE 1=1'
    const params = []
    let paramCount = 1

    if (approved !== undefined) {
      query += ` AND is_approved = $${paramCount}`
      params.push(approved === 'true')
      paramCount++
    }

    query += ' ORDER BY created_at DESC LIMIT $' + paramCount + ' OFFSET $' + (paramCount + 1)
    params.push(parseInt(limit), parseInt(offset))

    const result = await pool.query(query, params)

    const countResult = await pool.query('SELECT COUNT(*) FROM messages')
    const total = parseInt(countResult.rows[0].count)

    return successResponse(res, {
      messages: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    })
  } catch (error) {
    logger.error('Get messages error:', error)
    return serverErrorResponse(res)
  }
})

router.put('/:id', authMiddleware, requirePermission('messages:delete'), async (req, res) => {
  try {
    const { id } = req.params
    const { is_approved } = req.body

    const result = await pool.query(
      'UPDATE messages SET is_approved = $1 WHERE id = $2 RETURNING *',
      [is_approved, id]
    )

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Message not found')
    }

    logger.info(`Message ${id} approved status updated to ${is_approved}`)

    return successResponse(res, { message: result.rows[0] }, 'Message updated successfully')
  } catch (error) {
    logger.error('Update message error:', error)
    return serverErrorResponse(res)
  }
})

router.delete('/:id', authMiddleware, requirePermission('messages:delete'), async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Message not found')
    }

    logger.info(`Message ${id} deleted`)

    return successResponse(res, null, 'Message deleted successfully')
  } catch (error) {
    logger.error('Delete message error:', error)
    return serverErrorResponse(res)
  }
})

module.exports = router
