const Joi = require('joi')

const userQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
  keyword: Joi.string().allow('').default(''),
  role: Joi.string().allow('').default(''),
})

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false })
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }))
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors,
        },
      })
    }
    
    req.query = value
    next()
  }
}

module.exports = {
  userQuerySchema,
  validateQuery,
}
