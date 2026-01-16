const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserRepository } = require('../repositories')
const {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  BadRequestError,
} = require('../utils/errors')
const config = require('../config')
const { pool } = require('../database/db')

class AuthService {
  constructor() {
    this.userRepository = new UserRepository(pool)
  }

  async register(userData) {
    const { username, email, password } = userData

    const existingUser = await this.userRepository.findByUsername(username)
    if (existingUser) {
      throw new ConflictError('Username already exists')
    }

    const existingEmail = await this.userRepository.findByEmail(email)
    if (existingEmail) {
      throw new ConflictError('Email already exists')
    }

    const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds)

    const newUser = await this.userRepository.create({
      username,
      email,
      passwordHash,
      roleId: 3,
    })

    const token = this.generateToken(newUser)

    return {
      user: this.sanitizeUser(newUser),
      token,
    }
  }

  async login(credentials) {
    const { username, password } = credentials

    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const token = this.generateToken(user)

    return {
      user: this.sanitizeUser(user),
      token,
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret)
      const user = await this.userRepository.findById(decoded.userId)

      if (!user) {
        throw new UnauthorizedError('User not found')
      }

      return this.sanitizeUser(user)
    } catch (error) {
      throw new UnauthorizedError('Invalid token')
    }
  }

  generateToken(user) {
    const payload = {
      userId: user.id,
      username: user.username,
      roleId: user.role_id,
    }

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    })
  }

  sanitizeUser(user) {
    const { password_hash, role_name, ...sanitized } = user
    if (role_name) {
      sanitized.role = role_name
    }
    return sanitized
  }
}

module.exports = AuthService
