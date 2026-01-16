const express = require('express')
const { RoleService } = require('../services')
const { authMiddleware, requirePermission } = require('../middleware/auth')
const { createRoleSchema, updateRoleSchema, validate } = require('../validators')
const { successResponse } = require('../utils/response')

const router = express.Router()
const roleService = new RoleService()

router.get('/', authMiddleware, requirePermission('users:view'), async (req, res, next) => {
  try {
    const roles = await roleService.getRoles()
    return successResponse(res, { roles })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', authMiddleware, requirePermission('users:view'), async (req, res, next) => {
  try {
    const role = await roleService.getRoleById(req.params.id)
    return successResponse(res, { role })
  } catch (error) {
    next(error)
  }
})

router.post('/', authMiddleware, requirePermission('users:manage'), validate(createRoleSchema), async (req, res, next) => {
  try {
    const role = await roleService.createRole(req.body)
    return successResponse(res, { role }, 'Role created successfully')
  } catch (error) {
    next(error)
  }
})

router.put('/:id', authMiddleware, requirePermission('users:manage'), validate(updateRoleSchema), async (req, res, next) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body)
    return successResponse(res, { role }, 'Role updated successfully')
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', authMiddleware, requirePermission('users:manage'), async (req, res, next) => {
  try {
    await roleService.deleteRole(req.params.id)
    return successResponse(res, null, 'Role deleted successfully')
  } catch (error) {
    next(error)
  }
})

module.exports = router
