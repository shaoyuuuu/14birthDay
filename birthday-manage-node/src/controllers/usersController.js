const express = require('express')
const { UserService } = require('../services')
const { authMiddleware, requirePermission } = require('../middleware/auth')
const { createUserSchema, updateUserSchema, validate, userQuerySchema, validateQuery } = require('../validators')
const { successResponse } = require('../utils/response')

const router = express.Router()
const userService = new UserService()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: 获取用户列表
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, editor, viewer]
 *         description: 角色筛选
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authMiddleware, requirePermission('users:view'), validateQuery(userQuerySchema), async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.query)
    return successResponse(res, result)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /users/roles:
 *   get:
 *     summary: 获取角色列表
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         roles:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               value:
 *                                 type: string
 *                               label:
 *                                 type: string
 */
router.get('/roles', authMiddleware, requirePermission('users:view'), async (req, res, next) => {
  try {
    const roles = await userService.getRoles()
    return successResponse(res, { roles })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: 获取用户详情
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authMiddleware, requirePermission('users:view'), async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)
    return successResponse(res, { user })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 创建用户
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: 用户名或邮箱已存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, requirePermission('users:manage'), validate(createUserSchema), async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body, req.user.id)
    return successResponse(res, { user }, 'User created successfully')
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: 更新用户
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authMiddleware, requirePermission('users:edit'), validate(updateUserSchema), async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user.id)
    return successResponse(res, { user }, 'User updated successfully')
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: 删除用户
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 不能删除自己的账户
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authMiddleware, requirePermission('users:delete'), async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user.id)
    return successResponse(res, null, 'User deleted successfully')
  } catch (error) {
    next(error)
  }
})

module.exports = router
