const { pool } = require('../database/db')

class QueryBuilder {
  constructor(tableName) {
    this.tableName = tableName
    this.query = ''
    this.params = []
    this.paramCount = 1
    this.whereConditions = []
    this.joins = []
    this.orderBy = []
    this.limit = null
    this.offset = null
  }

  select(columns = '*') {
    this.query = `SELECT ${columns} FROM ${this.tableName}`
    return this
  }

  join(table, onCondition, type = 'INNER') {
    this.joins.push(`${type} JOIN ${table} ON ${onCondition}`)
    return this
  }

  leftJoin(table, onCondition) {
    return this.join(table, onCondition, 'LEFT')
  }

  rightJoin(table, onCondition) {
    return this.join(table, onCondition, 'RIGHT')
  }

  where(condition, param = null) {
    this.whereConditions.push(condition)
    if (param !== null) {
      this.params.push(param)
    }
    return this
  }

  whereIn(column, values) {
    const placeholders = values.map(() => `$${this.paramCount++}`).join(', ')
    this.whereConditions.push(`${column} IN (${placeholders})`)
    this.params.push(...values)
    return this
  }

  whereLike(column, value, caseInsensitive = true) {
    const operator = caseInsensitive ? 'ILIKE' : 'LIKE'
    this.whereConditions.push(`${column} ${operator} $${this.paramCount++}`)
    this.params.push(`%${value}%`)
    return this
  }

  whereBetween(column, min, max) {
    this.whereConditions.push(`${column} BETWEEN $${this.paramCount++} AND $${this.paramCount++}`)
    this.params.push(min, max)
    return this
  }

  orderBy(column, direction = 'ASC') {
    this.orderBy.push(`${column} ${direction}`)
    return this
  }

  limit(count) {
    this.limit = count
    return this
  }

  offset(count) {
    this.offset = count
    return this
  }

  async execute() {
    let finalQuery = this.query

    if (this.joins.length > 0) {
      finalQuery += ' ' + this.joins.join(' ')
    }

    if (this.whereConditions.length > 0) {
      finalQuery += ' WHERE ' + this.whereConditions.join(' AND ')
    }

    if (this.orderBy.length > 0) {
      finalQuery += ' ORDER BY ' + this.orderBy.join(', ')
    }

    if (this.limit !== null) {
      finalQuery += ` LIMIT $${this.paramCount++}`
      this.params.push(this.limit)
    }

    if (this.offset !== null) {
      finalQuery += ` OFFSET $${this.paramCount++}`
      this.params.push(this.offset)
    }

    const result = await pool.query(finalQuery, this.params)
    return result.rows
  }

  async count() {
    let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`

    if (this.joins.length > 0) {
      countQuery += ' ' + this.joins.join(' ')
    }

    if (this.whereConditions.length > 0) {
      countQuery += ' WHERE ' + this.whereConditions.join(' AND ')
    }

    const result = await pool.query(countQuery, this.params)
    return parseInt(result.rows[0].total)
  }

  async first() {
    this.limit(1)
    const results = await this.execute()
    return results[0] || null
  }

  async paginate(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize
    const total = await this.count()
    
    this.limit(pageSize)
    this.offset(offset)
    
    const list = await this.execute()
    
    return {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  static table(tableName) {
    return new QueryBuilder(tableName)
  }
}

module.exports = QueryBuilder
