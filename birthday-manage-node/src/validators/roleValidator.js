const Joi = require('joi')

const VALID_PERMISSIONS = [
  'dashboard:view',
  'visits:view',
  'messages:view',
  'messages:manage',
  'memories:view',
  'memories:manage',
  'profile:view',
  'profile:edit',
  'users:view',
  'users:edit',
  'users:delete',
  'users:manage',
  'roles:view',
  'roles:edit',
  'roles:manage',
]

const createRoleSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(200).required(),
  permissions: Joi.array().items(Joi.string().valid(...VALID_PERMISSIONS)).default([]),
})

const updateRoleSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  description: Joi.string().max(200),
  permissions: Joi.array().items(Joi.string().valid(...VALID_PERMISSIONS)),
})

module.exports = {
  createRoleSchema,
  updateRoleSchema,
  VALID_PERMISSIONS,
}
