class RoleRepository {
  constructor(pool) {
    this.pool = pool
  }

  async findAll() {
    const query = `
      SELECT r.*, 
             COALESCE(
               ARRAY_AGG(DISTINCT p.name) FILTER (WHERE p.name IS NOT NULL),
               ARRAY[]::TEXT[]
             ) as permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      GROUP BY r.id
      ORDER BY r.id
    `
    const result = await this.pool.query(query)
    return result.rows
  }

  async findById(id) {
    const query = `
      SELECT r.*, 
             COALESCE(
               ARRAY_AGG(DISTINCT p.name) FILTER (WHERE p.name IS NOT NULL),
               ARRAY[]::TEXT[]
             ) as permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE r.id = $1
      GROUP BY r.id
    `
    const result = await this.pool.query(query, [id])
    return result.rows[0]
  }

  async findByName(name) {
    const query = `
      SELECT r.*, 
             COALESCE(
               ARRAY_AGG(DISTINCT p.name) FILTER (WHERE p.name IS NOT NULL),
               ARRAY[]::TEXT[]
             ) as permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE r.name = $1
      GROUP BY r.id
    `
    const result = await this.pool.query(query, [name])
    return result.rows[0]
  }

  async create(roleData) {
    const { name, description, permissions } = roleData
    const client = await this.pool.connect()
    
    try {
      await client.query('BEGIN')

      const roleResult = await client.query(
        'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
      )
      const role = roleResult.rows[0]

      if (permissions && permissions.length > 0) {
        for (const permName of permissions) {
          const permResult = await client.query(
            'SELECT id FROM permissions WHERE name = $1',
            [permName]
          )
          if (permResult.rows.length > 0) {
            await client.query(
              'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
              [role.id, permResult.rows[0].id]
            )
          }
        }
      }

      await client.query('COMMIT')
      return this.findById(role.id)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async update(id, roleData) {
    const { name, description, permissions } = roleData
    const client = await this.pool.connect()
    
    try {
      await client.query('BEGIN')

      await client.query(
        'UPDATE roles SET name = $1, description = $2, updated_at = NOW() WHERE id = $3',
        [name, description, id]
      )

      if (permissions !== undefined) {
        await client.query('DELETE FROM role_permissions WHERE role_id = $1', [id])

        if (permissions.length > 0) {
          for (const permName of permissions) {
            const permResult = await client.query(
              'SELECT id FROM permissions WHERE name = $1',
              [permName]
            )
            if (permResult.rows.length > 0) {
              await client.query(
                'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
                [id, permResult.rows[0].id]
              )
            }
          }
        }
      }

      await client.query('COMMIT')
      return this.findById(id)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async delete(id) {
    const query = 'DELETE FROM roles WHERE id = $1 RETURNING id'
    const result = await this.pool.query(query, [id])
    return result.rows[0]
  }

  async checkUsersWithRole(id) {
    const query = 'SELECT COUNT(*) as count FROM admins WHERE role_id = $1'
    const result = await this.pool.query(query, [id])
    return parseInt(result.rows[0].count)
  }
}

module.exports = RoleRepository
