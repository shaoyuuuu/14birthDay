class RoleRepository {
  constructor(pool) {
    this.pool = pool
  }

  async findAll() {
    const query = 'SELECT * FROM roles ORDER BY id'
    const result = await this.pool.query(query)
    return result.rows
  }

  async findById(id) {
    const query = 'SELECT * FROM roles WHERE id = $1'
    const result = await this.pool.query(query, [id])
    return result.rows[0]
  }

  async findByName(name) {
    const query = 'SELECT * FROM roles WHERE name = $1'
    const result = await this.pool.query(query, [name])
    return result.rows[0]
  }

  async create(roleData) {
    const { name, description, permissions } = roleData
    const query = `
      INSERT INTO roles (name, description, permissions) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `
    const result = await this.pool.query(query, [name, description, permissions])
    return result.rows[0]
  }

  async update(id, roleData) {
    const { name, description, permissions } = roleData
    const query = `
      UPDATE roles 
      SET name = $1, description = $2, permissions = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `
    const result = await this.pool.query(query, [name, description, permissions, id])
    return result.rows[0]
  }

  async delete(id) {
    const query = 'DELETE FROM roles WHERE id = $1 RETURNING id'
    const result = await this.pool.query(query, [id])
    return result.rows[0]
  }
}

module.exports = RoleRepository
