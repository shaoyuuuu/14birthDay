const { UserRepository, RoleRepository } = require('../repositories')
const { NotFoundError, ConflictError, BadRequestError, ForbiddenError } = require('../utils/errors')
const { pool } = require('../database/db')

class UserService {
  constructor() {
    this.userRepository = new UserRepository(pool)
    this.roleRepository = new RoleRepository(pool)
  }

  async getUsers(filters) {
    return await this.userRepository.findAll(filters)
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    const { role_name, ...sanitized } = user
    if (role_name) {
      sanitized.role = role_name
    }
    return sanitized
  }

  async createUser(userData, currentUserId) {
    const { username, email, password, role } = userData

    const exists = await this.userRepository.existsByUsernameOrEmail(username, email)
    if (exists) {
      throw new ConflictError('Username or email already exists')
    }

    const roleData = await this.roleRepository.findByName(role || 'viewer')
    if (!roleData) {
      throw new BadRequestError('Invalid role')
    }

    const bcrypt = require('bcryptjs')
    const config = require('../config')
    const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds)

    const user = await this.userRepository.create({
      username,
      email,
      passwordHash,
      roleId: roleData.id,
    })

    return await this.userRepository.findById(user.id)
  }

  async updateUser(id, userData, currentUserId) {
    const { username, email, role } = userData

    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    if (parseInt(id) === currentUserId) {
      throw new ForbiddenError('Cannot modify your own account through this endpoint')
    }

    const exists = await this.userRepository.existsByUsernameOrEmail(username, email, id)
    if (exists) {
      throw new ConflictError('Username or email already exists')
    }

    const roleData = await this.roleRepository.findByName(role)
    if (!roleData) {
      throw new BadRequestError('Invalid role')
    }

    await this.userRepository.update(id, {
      username,
      email,
      roleId: roleData.id,
    })

    return await this.userRepository.findById(id)
  }

  async deleteUser(id, currentUserId) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    if (parseInt(id) === currentUserId) {
      throw new ForbiddenError('Cannot delete your own account')
    }

    await this.userRepository.delete(id)
    return { id }
  }

  async getRoles() {
    const roles = await this.roleRepository.findAll()
    return roles.map(role => ({
      value: role.name,
      label: role.description || role.name,
    }))
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    const bcrypt = require('bcryptjs')
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isPasswordValid) {
      throw new BadRequestError('Current password is incorrect')
    }

    const config = require('../config')
    const passwordHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds)

    await this.userRepository.update(userId, {
      username: user.username,
      email: user.email,
      roleId: user.role_id,
    })

    return { success: true }
  }
}

module.exports = UserService
