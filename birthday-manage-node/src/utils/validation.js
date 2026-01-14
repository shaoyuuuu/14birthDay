const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const messageSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().optional(),
  message: Joi.string().min(1).max(2000).required()
});

const memorySchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(500).optional(),
  memory_content: Joi.string().required(),
  date: Joi.date().required(),
  images: Joi.array().items(Joi.string()).optional(),
  comment: Joi.string().max(500).optional()
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  registerSchema,
  loginSchema,
  messageSchema,
  memorySchema,
  validate
};
