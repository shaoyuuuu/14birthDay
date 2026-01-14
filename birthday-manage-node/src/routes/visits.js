const express = require('express');
const { pool } = require('../database/db');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { ip_address, user_agent, page_url, referrer } = req.body;

    const result = await pool.query(
      'INSERT INTO visits (ip_address, user_agent, page_url, referrer) VALUES ($1, $2, $3, $4) RETURNING *',
      [ip_address, user_agent, page_url, referrer]
    );

    logger.info(`Visit recorded from ${ip_address}`);

    res.status(201).json({
      message: 'Visit recorded successfully',
      visit: result.rows[0]
    });
  } catch (error) {
    logger.error('Record visit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { start_date, end_date, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM visits WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (start_date) {
      query += ` AND visit_date >= $${paramCount}`;
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND visit_date <= $${paramCount}`;
      params.push(end_date);
      paramCount++;
    }

    query += ' ORDER BY visit_date DESC LIMIT $' + paramCount + ' OFFSET $' + (paramCount + 1);
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    const countResult = await pool.query('SELECT COUNT(*) FROM visits');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      visits: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error('Get visits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const totalResult = await pool.query('SELECT COUNT(*) FROM visits');
    const total = parseInt(totalResult.rows[0].count);

    const recentResult = await pool.query(
      'SELECT COUNT(*) FROM visits WHERE visit_date >= NOW() - INTERVAL \\'1 day\\' * $1',
      [parseInt(days)]
    );
    const recent = parseInt(recentResult.rows[0].count);

    const uniqueResult = await pool.query(
      'SELECT COUNT(DISTINCT ip_address) FROM visits'
    );
    const unique = parseInt(uniqueResult.rows[0].count);

    const dailyResult = await pool.query(`
      SELECT 
        DATE(visit_date) as date,
        COUNT(*) as count
      FROM visits
      WHERE visit_date >= NOW() - INTERVAL '1 day' * $1
      GROUP BY DATE(visit_date)
      ORDER BY date DESC
    `, [parseInt(days)]);

    const topPagesResult = await pool.query(`
      SELECT 
        page_url,
        COUNT(*) as count
      FROM visits
      WHERE page_url IS NOT NULL
      GROUP BY page_url
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({
      stats: {
        total,
        recent,
        unique
      },
      daily: dailyResult.rows,
      topPages: topPagesResult.rows
    });
  } catch (error) {
    logger.error('Get visit stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
