const express = require('express')
const { pool } = require('../database/db')
const { authMiddleware, requirePermission } = require('../middleware/auth')
const { memorySchema, validate } = require('../utils/validation')
const logger = require('../utils/logger')
const {
  successResponse,
  createdResponse,
  notFoundResponse,
  serverErrorResponse,
} = require('../utils/response')

const router = express.Router()

router.post(
  '/',
  authMiddleware,
  requirePermission('memories:create'),
  validate(memorySchema),
  async (req, res) => {
    try {
      const { title, description, memory_content, date, images, comment } = req.body

      const result = await pool.query(
        'INSERT INTO memories (title, description, memory_content, date, images, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, memory_content, date, images, comment]
      )

      logger.info(`New memory created: ${title}`)

      return createdResponse(res, { memory: result.rows[0] }, 'Memory created successfully')
    } catch (error) {
      logger.error('Create memory error:', error)
      return serverErrorResponse(res)
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query

    const result = await pool.query(
      'SELECT * FROM memories ORDER BY date DESC LIMIT $1 OFFSET $2',
      [parseInt(limit), parseInt(offset)]
    )

    const countResult = await pool.query('SELECT COUNT(*) FROM memories')
    const total = parseInt(countResult.rows[0].count)

    return successResponse(res, {
      memories: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    })
  } catch (error) {
    logger.error('Get memories error:', error)
    return serverErrorResponse(res)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query('SELECT * FROM memories WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Memory not found')
    }

    return successResponse(res, { memory: result.rows[0] })
  } catch (error) {
    logger.error('Get memory error:', error)
    return serverErrorResponse(res)
  }
})

router.put('/:id', authMiddleware, requirePermission('memories:edit'), async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, memory_content, date, images, comment } = req.body

    const result = await pool.query(
      'UPDATE memories SET title = $1, description = $2, memory_content = $3, date = $4, images = $5, comment = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [title, description, memory_content, date, images, comment, id]
    )

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Memory not found')
    }

    logger.info(`Memory ${id} updated`)

    return successResponse(res, { memory: result.rows[0] }, 'Memory updated successfully')
  } catch (error) {
    logger.error('Update memory error:', error)
    return serverErrorResponse(res)
  }
})

router.delete('/:id', authMiddleware, requirePermission('memories:delete'), async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query('DELETE FROM memories WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Memory not found')
    }

    logger.info(`Memory ${id} deleted`)

    return successResponse(res, null, 'Memory deleted successfully')
  } catch (error) {
    logger.error('Delete memory error:', error)
    return serverErrorResponse(res)
  }
})

module.exports = router
