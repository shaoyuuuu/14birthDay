const { pool } = require('../database/db')
const logger = require('../utils/logger')

async function createTables() {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')

    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
        permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
      )
    `)

    await client.query(`
      ALTER TABLE admins ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id)
    `)

    const existingRoles = await client.query('SELECT name FROM roles')
    const roleNames = existingRoles.rows.map(r => r.name)

    if (!roleNames.includes('admin')) {
      await client.query(`
        INSERT INTO roles (name, description) VALUES 
        ('admin', '管理员 - 拥有所有权限'),
        ('editor', '编辑者 - 可以管理内容'),
        ('viewer', '访客 - 只能查看内容')
      `)
    }

    const existingPermissions = await client.query('SELECT name FROM permissions')
    const permissionNames = existingPermissions.rows.map(p => p.name)

    const allPermissions = [
      { name: 'dashboard:view', description: '查看仪表板' },
      { name: 'visits:view', description: '查看访问统计' },
      { name: 'messages:view', description: '查看留言' },
      { name: 'messages:delete', description: '删除留言' },
      { name: 'memories:view', description: '查看回忆' },
      { name: 'memories:create', description: '创建回忆' },
      { name: 'memories:edit', description: '编辑回忆' },
      { name: 'memories:delete', description: '删除回忆' },
      { name: 'profile:view', description: '查看个人信息' },
      { name: 'profile:edit', description: '编辑个人信息' },
      { name: 'users:view', description: '查看用户' },
      { name: 'users:edit', description: '编辑用户' },
      { name: 'users:delete', description: '删除用户' },
      { name: 'roles:view', description: '查看角色' },
      { name: 'roles:edit', description: '编辑角色' }
    ]

    for (const perm of allPermissions) {
      if (!permissionNames.includes(perm.name)) {
        await client.query(
          'INSERT INTO permissions (name, description) VALUES ($1, $2)',
          [perm.name, perm.description]
        )
      }
    }

    const adminRole = await client.query("SELECT id FROM roles WHERE name = 'admin'")
    const editorRole = await client.query("SELECT id FROM roles WHERE name = 'editor'")
    const viewerRole = await client.query("SELECT id FROM roles WHERE name = 'viewer'")

    const allPermissionsIds = await client.query('SELECT id FROM permissions')

    for (const perm of allPermissionsIds.rows) {
      await client.query(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [adminRole.rows[0].id, perm.id]
      )
    }

    const editorPermissions = ['dashboard:view', 'visits:view', 'messages:view', 'messages:delete', 'memories:view', 'memories:create', 'memories:edit', 'memories:delete', 'profile:view', 'profile:edit']
    for (const permName of editorPermissions) {
      const perm = await client.query('SELECT id FROM permissions WHERE name = $1', [permName])
      if (perm.rows.length > 0) {
        await client.query(
          'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [editorRole.rows[0].id, perm.rows[0].id]
        )
      }
    }

    const viewerPermissions = ['dashboard:view', 'visits:view', 'messages:view', 'memories:view', 'profile:view', 'profile:edit']
    for (const permName of viewerPermissions) {
      const perm = await client.query('SELECT id FROM permissions WHERE name = $1', [permName])
      if (perm.rows.length > 0) {
        await client.query(
          'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [viewerRole.rows[0].id, perm.rows[0].id]
        )
      }
    }

    const viewerRoleId = viewerRole.rows[0].id
    await client.query(`
      UPDATE admins SET role_id = $1 WHERE role_id IS NULL
    `, [viewerRoleId])

    await client.query('COMMIT')
    logger.info('Database tables created and initialized successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    logger.error('Error creating database tables:', error)
    throw error
  } finally {
    client.release()
  }
}

module.exports = { createTables }
