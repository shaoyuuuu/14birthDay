const express = require('express');
const { pool } = require('../database/db');
const auth = require('../middleware/auth');
const { memorySchema, validate } = require('../utils/validation');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/', auth, validate(memorySchema), async (req, res) => {
  try {
    const { title, description, memory_content, date, images, comment } = req.body;

    const result = await pool.query(
      'INSERT INTO memories (title, description, memory_content, date, images, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, memory_content, date, images, comment]
    );

    logger.info(`New memory created: ${title}`);

    res.status(201).json({
      message: 'Memory created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Create memory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const result = await pool.query(
      'SELECT * FROM memories ORDER BY date DESC LIMIT $1 OFFSET $2',
      [parseInt(limit), parseInt(offset)]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM memories');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      memories: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error('Get memories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM memories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    res.json({
      memory: result.rows[0]
    });
  } catch (error) {
    logger.error('Get memory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, memory_content, date, images, comment } = req.body;

    const result = await pool.query(
      'UPDATE memories SET title = $1, description = $2, memory_content = $3, date = $4, images = $5, comment = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [title, description, memory_content, date, images, comment, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    logger.info(`Memory ${id} updated`);

    res.json({
      message: 'Memory updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Update memory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM memories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    logger.info(`Memory ${id} deleted`);

    res.json({
      message: 'Memory deleted successfully'
    });
  } catch (error) {
    logger.error('Delete memory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
