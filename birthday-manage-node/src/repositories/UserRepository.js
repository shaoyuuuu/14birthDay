class UserRepository {
  constructor(pool) {
    this.pool = pool
  }

  async findById(id) {
    const query = `
      SELECT a.id, a.username, a.email, a.role_id, r.name as role_name, a.created_at, a.updated_at
      FROM admins a
      LEFT JOIN roles r ON a.role_id = r.id
      WHERE a.id = $1
    `
    const result = await this.pool.query(query, [id])
    return result.rows[0]
  }

  async findByUsername(username) {
    const query = `
      SELECT a.*, r.name as role_name
      FROM admins a
      LEFT JOIN roles r ON a.role_id = r.id
      WHERE a.username = $1
    `
    const result = await this.pool.query(query, [username])
    return result.rows[0]
  }

  async findByEmail(email) {
    const query = `
      SELECT a.*, r.name as role_name
      FROM admins a
      LEFT JOIN roles r ON a.role_id = r.id
      WHERE a.email = $1
    `
    const result = await this.pool.query(query, [email])
    return result.rows[0]
  }

  async findAll(filters = {}) {
    const { page = 1, pageSize = 10, keyword = '', role = '' } = filters
    const offset = (page - 1) * pageSize

    let query = `
      SELECT a.id, a.username, a.email, r.name as role, a.created_at 
      FROM admins a
      LEFT JOIN roles r ON a.role_id = r.id
      WHERE 1=1
    `
    const queryParams = []
    let paramCount = 1
    let whereConditions = ''

    if (keyword) {
      const condition = ` AND (a.username ILIKE $${paramCount} OR a.email ILIKE $${paramCount + 1})`
      query += condition
      whereConditions += condition
      queryParams.push(`%${keyword}%`, `%${keyword}%`)
      paramCount += 2
    }

    if (role) {
      const condition = ` AND r.name = $${paramCount}`
      query += condition
      whereConditions += condition
      queryParams.push(role)
      paramCount++
    }

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM admins a
      LEFT JOIN roles r ON a.role_id = r.id
      WHERE 1=1${whereConditions}
    `

    const countResult = await this.pool.query(countQuery, queryParams.slice(0, queryParams.length))
    const total = parseInt(countResult.rows[0].total)

    query += ` ORDER BY a.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    queryParams.push(pageSize, offset)

    const result = await this.pool.query(query, queryParams)

    return {
      list: result.rows,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    }
  }

  async create(userData) {
    const { username, email, passwordHash, roleId } = userData
    const query = `
      INSERT INTO admins (username, email, password_hash, role_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, username, email, role_id, created_at
    `
    const result = await this.pool.query(query, [username, email, passwordHash, roleId])
    return result.rows[0]
  }

  async update(id, userData) {
    const { username, email, roleId } = userData
    const query = `
      UPDATE admins 
      SET username = $1, email = $2, role_id = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, username, email, role_id, updated_at
    `
    const result = await this.pool.query(query, [username, email, roleId, id])
    return result.rows[0]
  }

  async delete(id) {
    const query = 'DELETE FROM admins WHERE id = $1 RETURNING id'
    const result = await this.pool.query(query, [id])
    return result.rows[0]
  }

  async existsByUsernameOrEmail(username, email, excludeId = null) {
    let query = 'SELECT id FROM admins WHERE (username = $1 OR email = $2)'
    const params = [username, email]

    if (excludeId) {
      query += ' AND id != $3'
      params.push(excludeId)
    }

    const result = await this.pool.query(query, params)
    return result.rows.length > 0
  }
}

module.exports = UserRepository
