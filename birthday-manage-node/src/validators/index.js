const { registerSchema, loginSchema, createUserSchema, updateUserSchema, changePasswordSchema, validate } = require('./authValidator')
const { userQuerySchema, validateQuery } = require('./queryValidator')
const { createRoleSchema, updateRoleSchema } = require('./roleValidator')

module.exports = {
  registerSchema,
  loginSchema,
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  userQuerySchema,
  createRoleSchema,
  updateRoleSchema,
  validate,
  validateQuery,
}
