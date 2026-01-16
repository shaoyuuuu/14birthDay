const express = require('express')
const bcrypt = require('bcryptjs')
const { pool } = require('../database/db')
const { authMiddleware, requirePermission } = require('../middleware/auth')
const { logger } = require('../utils/logger')
const {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
} = require('../utils/response')

const router = express.Router()

// 获取用户列表
router.get('/', authMiddleware, requirePermission('users:view'), async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword = '', role = '' } = req.query
    const offset = (page - 1) * pageSize

    let query = `
      SELECT a.id, a.username, a.email, r.name as role, a.created_at 
      FROM admins a
      LEFT JOIN roles r ON a.role_id = r.id
      WHERE 1=1
    `
    const queryParams = []
    let paramCount = 1

    // 保存查询条件，用于构建计数查询
    let whereConditions = ''

    if (keyword) {
      const condition = ` AND (a.username ILIKE $${paramCount} OR a.email ILIKE $${paramCount})`
      query += condition
      whereConditions += condition
      queryParams.push(`%${keyword}%`)
      paramCount++
    }

    if (role) {
      const condition = ` AND r.name = $${paramCount}`
      query += condition
      whereConditions += condition
      queryParams.push(role)
      paramCount++
    }

    // 构建计数查询
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM admins a
      LEFT JOIN roles r ON a.role_id = r.id
      WHERE 1=1${whereConditions}
    `

    // 执行计数查询
    const countResult = await pool.query(countQuery, queryParams.slice(0, queryParams.length))
    const total = parseInt(countResult.rows[0].total)

    query += ` ORDER BY a.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    queryParams.push(pageSize, offset)

    const result = await pool.query(query, queryParams)

    return successResponse(res, {
      list: result.rows,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    })
  } catch (error) {
    logger.error('Get users error:', error)
    return serverErrorResponse(res)
  }
})

// 获取单个用户详情
router.get('/:id', authMiddleware, requirePermission('users:view'), async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT a.id, a.username, a.email, r.name as role, a.created_at 
       FROM admins a 
       LEFT JOIN roles r ON a.role_id = r.id 
       WHERE a.id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return notFoundResponse(res, 'User not found')
    }

    return successResponse(res, { user: result.rows[0] })
  } catch (error) {
    logger.error('Get user error:', error)
    return serverErrorResponse(res)
  }
})

// 创建新用户
router.post('/', authMiddleware, requirePermission('users:manage'), async (req, res) => {
  try {
    const { username, email, password, role = 'viewer' } = req.body

    // 检查用户名和邮箱是否已存在
    const existingUser = await pool.query(
      'SELECT * FROM admins WHERE username = $1 OR email = $2',
      [username, email]
    )

    if (existingUser.rows.length > 0) {
      return badRequestResponse(res, 'Username or email already exists')
    }

    // 获取角色 ID
    const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [role])

    if (roleResult.rows.length === 0) {
      return badRequestResponse(res, 'Invalid role')
    }

    const roleId = roleResult.rows[0].id

    // 哈希密码
    const passwordHash = await bcrypt.hash(password, 10)

    // 创建用户
    const result = await pool.query(
      'INSERT INTO admins (username, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role_id, created_at',
      [username, email, passwordHash, roleId]
    )

    // 获取完整用户信息（包含角色名称）
    const fullUserResult = await pool.query(
      `SELECT a.id, a.username, a.email, r.name as role, a.created_at 
       FROM admins a 
       LEFT JOIN roles r ON a.role_id = r.id 
       WHERE a.id = $1`,
      [result.rows[0].id]
    )

    logger.info(`User ${result.rows[0].id} created by ${req.user.id}`)
    return successResponse(res, { user: fullUserResult.rows[0] }, 'User created successfully')
  } catch (error) {
    logger.error('Create user error:', error)
    return serverErrorResponse(res)
  }
})

// 更新用户信息
router.put('/:id', authMiddleware, requirePermission('users:edit'), async (req, res) => {
  try {
    const { id } = req.params
    const { username, email, role } = req.body

    // 检查用户是否存在
    const existingUser = await pool.query('SELECT id FROM admins WHERE id = $1', [id])

    if (existingUser.rows.length === 0) {
      return notFoundResponse(res, 'User not found')
    }

    // 检查用户名和邮箱是否已被其他用户使用
    const conflictingUser = await pool.query(
      'SELECT * FROM admins WHERE (username = $1 OR email = $2) AND id != $3',
      [username, email, id]
    )

    if (conflictingUser.rows.length > 0) {
      return badRequestResponse(res, 'Username or email already exists')
    }

    // 获取角色 ID
    const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [role])

    if (roleResult.rows.length === 0) {
      return badRequestResponse(res, 'Invalid role')
    }

    const roleId = roleResult.rows[0].id

    // 更新用户
    await pool.query(
      `UPDATE admins 
       SET username = $1, email = $2, role_id = $3 
       WHERE id = $4`,
      [username, email, roleId, id]
    )

    // 获取完整用户信息（包含角色名称）
    const fullUserResult = await pool.query(
      `SELECT a.id, a.username, a.email, r.name as role, a.created_at 
       FROM admins a 
       LEFT JOIN roles r ON a.role_id = r.id 
       WHERE a.id = $1`,
      [id]
    )

    logger.info(`User ${id} updated by ${req.user.id}`)
    return successResponse(res, { user: fullUserResult.rows[0] }, 'User updated successfully')
  } catch (error) {
    logger.error('Update user error:', error)
    return serverErrorResponse(res)
  }
})

// 删除用户
router.delete('/:id', authMiddleware, requirePermission('users:delete'), async (req, res) => {
  try {
    const { id } = req.params

    // 检查用户是否存在
    const existingUser = await pool.query('SELECT id FROM admins WHERE id = $1', [id])

    if (existingUser.rows.length === 0) {
      return notFoundResponse(res, 'User not found')
    }

    // 不能删除自己
    if (parseInt(id) === req.user.id) {
      return badRequestResponse(res, 'Cannot delete your own account')
    }

    // 删除用户
    await pool.query('DELETE FROM admins WHERE id = $1', [id])

    logger.info(`User ${id} deleted by ${req.user.id}`)
    return successResponse(res, null, 'User deleted successfully')
  } catch (error) {
    logger.error('Delete user error:', error)
    return serverErrorResponse(res)
  }
})

// 获取角色列表
router.get('/roles', authMiddleware, requirePermission('users:view'), async (req, res) => {
  try {
    const roles = [
      { value: 'admin', label: '管理员' },
      { value: 'editor', label: '编辑者' },
      { value: 'viewer', label: '访客' },
    ]
    return successResponse(res, { roles })
  } catch (error) {
    logger.error('Get user roles error:', error)
    return serverErrorResponse(res)
  }
})

module.exports = router
