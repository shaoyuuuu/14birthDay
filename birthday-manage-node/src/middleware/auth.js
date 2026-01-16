const { pool } = require('../database/db')
const { logger } = require('../utils/logger')
const jwt = require('jsonwebtoken')

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
        data: null,
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const result = await pool.query(
      `SELECT u.id, u.username, u.email, u.role_id, r.name as role_name,
              ARRAY_AGG(DISTINCT p.name) FILTER (WHERE p.name IS NOT NULL) as permissions
       FROM admins u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       WHERE u.id = $1
       GROUP BY u.id, u.username, u.email, u.role_id, r.name`,
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
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
      success: false,
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
          success: false,
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
          success: false,
          message: `缺少权限: ${permissionName}`,
          data: null,
        })
      }

      next()
    } catch (error) {
      logger.error('Permission middleware error:', error)
      return res.status(500).json({
        success: false,
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
          success: false,
          message: '未认证',
          data: null,
        })
      }

      if (req.user.role_name !== roleName) {
        return res.status(403).json({
          success: false,
          message: `需要角色: ${roleName}`,
          data: null,
        })
      }

      next()
    } catch (error) {
      logger.error('Role middleware error:', error)
      return res.status(500).json({
        success: false,
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
