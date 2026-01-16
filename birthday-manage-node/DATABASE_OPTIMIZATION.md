# 数据库优化指南

## 概述

本文档提供了数据库查询和性能优化的最佳实践指南。

## 查询优化

### 1. 使用 QueryBuilder

QueryBuilder 提供了链式 API 来构建查询，避免 SQL 注入并提高代码可读性。

```javascript
const { QueryBuilder } = require('./utils/QueryBuilder')

const users = await QueryBuilder
  .table('admins')
  .select('id, username, email')
  .leftJoin('roles', 'admins.role_id = roles.id')
  .whereLike('admins.username', keyword)
  .orderBy('admins.created_at', 'DESC')
  .paginate(page, pageSize)
```

### 2. 使用索引

为经常查询的字段创建索引：

```javascript
const { DatabaseOptimizer } = require('./utils/DatabaseOptimizer')

await DatabaseOptimizer.createIndex('admins', ['username'])
await DatabaseOptimizer.createIndex('admins', ['email'])
await DatabaseOptimizer.createIndex('admins', ['role_id'])
```

### 3. 使用缓存

对于频繁访问但不常变化的数据，使用缓存：

```javascript
const { cacheManager } = require('./utils/cache')

const roles = await cacheManager.getOrSet(
  'roles:all',
  async () => {
    const result = await pool.query('SELECT * FROM roles')
    return result.rows
  },
  5 * 60 * 1000
)
```

## 性能监控

### 1. 分析慢查询

```javascript
const { DatabaseOptimizer } = require('./utils/DatabaseOptimizer')

const slowQueries = await DatabaseOptimizer.getSlowQueries(1000)
console.log('Slow queries:', slowQueries)
```

### 2. 查看表统计信息

```javascript
const stats = await DatabaseOptimizer.getTableStats('admins')
console.log('Table stats:', stats)
```

### 3. 查看索引统计

```javascript
const indexStats = await DatabaseOptimizer.getIndexStats('admins')
console.log('Index stats:', indexStats)
```

## 最佳实践

### 1. 避免 SELECT *

只选择需要的字段：

```javascript
const query = `
  SELECT id, username, email 
  FROM admins 
  WHERE id = $1
`
```

### 2. 使用 LIMIT 和 OFFSET

实现分页时使用 LIMIT 和 OFFSET：

```javascript
const query = `
  SELECT * FROM admins 
  ORDER BY created_at DESC 
  LIMIT $1 OFFSET $2
`
```

### 3. 使用 JOIN 而不是子查询

```javascript
const query = `
  SELECT a.*, r.name as role_name
  FROM admins a
  LEFT JOIN roles r ON a.role_id = r.id
  WHERE a.id = $1
`
```

### 4. 使用参数化查询

避免 SQL 注入：

```javascript
const query = 'SELECT * FROM admins WHERE username = $1'
const params = [username]
await pool.query(query, params)
```

### 5. 定期执行 VACUUM 和 ANALYZE

```javascript
await DatabaseOptimizer.vacuumTable('admins')
```

## 数据库连接池优化

### 配置连接池

```javascript
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
```

### 监控连接池状态

```javascript
const stats = await DatabaseOptimizer.getConnectionPoolStats()
console.log('Pool stats:', stats)
```

## 事务处理

### 使用事务

```javascript
const client = await pool.connect()

try {
  await client.query('BEGIN')
  
  await client.query('INSERT INTO users ...')
  await client.query('UPDATE roles ...')
  
  await client.query('COMMIT')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
}
```

## 批量操作

### 使用批量插入

```javascript
const query = `
  INSERT INTO admins (username, email, password_hash, role_id)
  VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)
`

const params = [
  'user1', 'user1@example.com', 'hash1', 1,
  'user2', 'user2@example.com', 'hash2', 2,
  'user3', 'user3@example.com', 'hash3', 3,
]

await pool.query(query, params)
```

## 监控和告警

### 设置性能监控

```javascript
setInterval(async () => {
  const slowQueries = await DatabaseOptimizer.getSlowQueries(1000)
  
  if (slowQueries.length > 0) {
    logger.warn('Found slow queries:', slowQueries)
  }
}, 5 * 60 * 1000)
```

### 设置连接池监控

```javascript
setInterval(async () => {
  const stats = await DatabaseOptimizer.getConnectionPoolStats()
  
  if (stats.waitingCount > 5) {
    logger.warn('Connection pool under pressure:', stats)
  }
}, 60 * 1000)
```

## 优化建议

1. **索引优化**
   - 为 WHERE、JOIN、ORDER BY 子句中的字段创建索引
   - 避免过多的索引，影响写入性能
   - 定期分析索引使用情况

2. **查询优化**
   - 避免 SELECT *
   - 使用 LIMIT 限制结果集
   - 使用 JOIN 代替子查询
   - 使用 EXISTS 代替 IN

3. **缓存策略**
   - 对频繁访问的数据使用缓存
   - 设置合理的过期时间
   - 定期清理过期缓存

4. **连接池管理**
   - 根据负载调整连接池大小
   - 监控连接池使用情况
   - 设置合理的超时时间

5. **定期维护**
   - 定期执行 VACUUM 和 ANALYZE
   - 监控慢查询并优化
   - 定期检查索引使用情况
