const { pool } = require('../database/db')

class DatabaseOptimizer {
  static async analyzeQuery(query, params = []) {
    const startTime = Date.now()
    try {
      const result = await pool.query(`EXPLAIN ANALYZE ${query}`, params)
      const duration = Date.now() - startTime
      
      return {
        success: true,
        duration,
        plan: result.rows,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  static async getSlowQueries(threshold = 1000) {
    const query = `
      SELECT 
        query,
        calls,
        total_time,
        mean_time,
        max_time
      FROM pg_stat_statements
      WHERE mean_time > $1
      ORDER BY mean_time DESC
      LIMIT 10
    `
    
    try {
      const result = await pool.query(query, [threshold])
      return result.rows
    } catch (error) {
      console.error('Error fetching slow queries:', error)
      return []
    }
  }

  static async getTableStats(tableName) {
    const query = `
      SELECT 
        schemaname,
        tablename,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples,
        last_vacuum,
        last_autovacuum,
        last_analyze,
        last_autoanalyze
      FROM pg_stat_user_tables
      WHERE tablename = $1
    `
    
    try {
      const result = await pool.query(query, [tableName])
      return result.rows[0]
    } catch (error) {
      console.error('Error fetching table stats:', error)
      return null
    }
  }

  static async getIndexStats(tableName) {
    const query = `
      SELECT 
        schemaname,
        tablename,
        indexname,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched
      FROM pg_stat_user_indexes
      WHERE tablename = $1
      ORDER BY idx_scan DESC
    `
    
    try {
      const result = await pool.query(query, [tableName])
      return result.rows
    } catch (error) {
      console.error('Error fetching index stats:', error)
      return []
    }
  }

  static async createIndex(tableName, columns, indexName = null) {
    if (!indexName) {
      indexName = `idx_${tableName}_${columns.join('_')}`
    }

    const query = `CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${columns.join(', ')})`
    
    try {
      await pool.query(query)
      return { success: true, indexName }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async vacuumTable(tableName) {
    const query = `VACUUM ANALYZE ${tableName}`
    
    try {
      await pool.query(query)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getConnectionPoolStats() {
    const poolStats = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    }
    
    return poolStats
  }
}

module.exports = DatabaseOptimizer
