const { RoleRepository } = require('../repositories')
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/errors')
const { pool } = require('../database/db')

class RoleService {
  constructor() {
    this.roleRepository = new RoleRepository(pool)
  }

  async getRoles() {
    return await this.roleRepository.findAll()
  }

  async getRoleById(id) {
    const role = await this.roleRepository.findById(id)
    if (!role) {
      throw new NotFoundError('Role not found')
    }
    return role
  }

  async createRole(roleData) {
    const { name, description, permissions } = roleData

    const existingRole = await this.roleRepository.findByName(name)
    if (existingRole) {
      throw new ConflictError('Role name already exists')
    }

    const role = await this.roleRepository.create({
      name,
      description,
      permissions: permissions || [],
    })

    return role
  }

  async updateRole(id, roleData) {
    const { name, description, permissions } = roleData

    const existingRole = await this.roleRepository.findById(id)
    if (!existingRole) {
      throw new NotFoundError('Role not found')
    }

    if (name && name !== existingRole.name) {
      const nameExists = await this.roleRepository.findByName(name)
      if (nameExists) {
        throw new ConflictError('Role name already exists')
      }
    }

    const role = await this.roleRepository.update(id, {
      name: name || existingRole.name,
      description: description !== undefined ? description : existingRole.description,
      permissions: permissions !== undefined ? permissions : existingRole.permissions,
    })

    return role
  }

  async deleteRole(id) {
    const role = await this.roleRepository.findById(id)
    if (!role) {
      throw new NotFoundError('Role not found')
    }

    if (role.name === 'admin') {
      throw new BadRequestError('Cannot delete admin role')
    }

    const usersWithRole = await this.roleRepository.checkUsersWithRole(id)
    if (usersWithRole > 0) {
      throw new BadRequestError('Cannot delete role with assigned users')
    }

    await this.roleRepository.delete(id)
    return { id }
  }

  async getRoleList() {
    const roles = await this.roleRepository.findAll()
    return roles.map(role => ({
      value: role.name,
      label: role.description || role.name,
      permissions: role.permissions,
    }))
  }
}

module.exports = RoleService
