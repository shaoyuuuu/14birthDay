const { registerSchema, loginSchema, createUserSchema, updateUserSchema, changePasswordSchema, validate } = require('./authValidator')
const { userQuerySchema, validateQuery } = require('./queryValidator')

module.exports = {
  registerSchema,
  loginSchema,
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  userQuerySchema,
  validate,
  validateQuery,
}
