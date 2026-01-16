const { pool } = require('../database/db')
const { logger } = require('../utils/logger')
const jwt = require('jsonwebtoken')

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未提供认证令牌',
        data: null,
      })
    }

    // 验证 JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 从数据库中获取用户信息
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, u.role_id, r.name as role_name
       FROM admins u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        code: 401,
        message: '无效的认证令牌',
        data: null,
      })
    }

    const user = result.rows[0]
    const { role_name, ...sanitized } = user
    if (role_name) {
      sanitized.role = role_name
    }
    req.user = sanitized
    next()
  } catch (error) {
    logger.error('Auth middleware error:', error)
    return res.status(401).json({
      code: 401,
      message: '认证失败',
      data: null,
    })
  }
}

function requirePermission(permissionName) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          code: 401,
          message: '未认证',
          data: null,
        })
      }

      const result = await pool.query(
        `SELECT p.name
         FROM permissions p
         INNER JOIN role_permissions rp ON p.id = rp.permission_id
         WHERE rp.role_id = $1 AND p.name = $2`,
        [req.user.role_id, permissionName]
      )

      if (result.rows.length === 0) {
        return res.status(403).json({
          code: 403,
          message: `缺少权限: ${permissionName}`,
          data: null,
        })
      }

      next()
    } catch (error) {
      logger.error('Permission middleware error:', error)
      return res.status(500).json({
        code: 500,
        message: '权限检查失败',
        data: null,
      })
    }
  }
}

function requireRole(roleName) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          code: 401,
          message: '未认证',
          data: null,
        })
      }

      if (req.user.role_name !== roleName) {
        return res.status(403).json({
          code: 403,
          message: `需要角色: ${roleName}`,
          data: null,
        })
      }

      next()
    } catch (error) {
      logger.error('Role middleware error:', error)
      return res.status(500).json({
        code: 500,
        message: '角色检查失败',
        data: null,
      })
    }
  }
}

async function getUserPermissions(userId) {
  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.description
       FROM permissions p
       INNER JOIN role_permissions rp ON p.id = rp.permission_id
       INNER JOIN admins u ON u.role_id = rp.role_id
       WHERE u.id = $1`,
      [userId]
    )
    return result.rows
  } catch (error) {
    logger.error('Error getting user permissions:', error)
    throw error
  }
}

module.exports = {
  authMiddleware,
  requirePermission,
  requireRole,
  getUserPermissions,
}
