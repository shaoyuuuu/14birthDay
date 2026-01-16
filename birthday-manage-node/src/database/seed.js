const bcrypt = require('bcryptjs');
const { pool } = require('./db');
const { logger } = require('../utils/logger');

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const passwordHash = await bcrypt.hash('admin123', 10);

    const result = await client.query(
      'INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING *',
      ['admin', 'admin@birthdaywish.com', passwordHash]
    );

    if (result.rows.length > 0) {
      logger.info('Default admin user created successfully');
      logger.info('Username: admin');
      logger.info('Password: admin123');
      logger.info('Please change the password after first login!');
    } else {
      logger.info('Admin user already exists');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seed().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
}

module.exports = seed;
