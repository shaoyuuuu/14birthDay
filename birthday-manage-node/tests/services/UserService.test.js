const { describe, it, expect, beforeEach } = require('@jest/globals')
const { UserService } = require('../../src/services/UserService')
const { UserRepository, RoleRepository } = require('../../src/repositories')
const bcrypt = require('bcryptjs')

jest.mock('../../src/repositories/UserRepository')
jest.mock('../../src/repositories/RoleRepository')
jest.mock('bcryptjs')

describe('UserService', () => {
  let userService
  let mockUserRepository
  let mockRoleRepository

  beforeEach(() => {
    mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByUsernameOrEmail: jest.fn(),
    }
    mockRoleRepository = {
      findByName: jest.fn(),
      findAll: jest.fn(),
    }

    UserRepository.mockImplementation(() => mockUserRepository)
    RoleRepository.mockImplementation(() => mockRoleRepository)
    userService = new UserService()
  })

  describe('getUsers', () => {
    it('should return paginated user list', async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        keyword: '',
        role: '',
      }

      const mockResult = {
        list: [
          { id: 1, username: 'user1', email: 'user1@example.com', role: 'admin' },
          { id: 2, username: 'user2', email: 'user2@example.com', role: 'viewer' },
        ],
        total: 2,
        page: 1,
        pageSize: 10,
      }

      mockUserRepository.findAll.mockResolvedValue(mockResult)

      const result = await userService.getUsers(filters)

      expect(result).toEqual(mockResult)
      expect(mockUserRepository.findAll).toHaveBeenCalledWith(filters)
    })
  })

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
      }

      mockUserRepository.findById.mockResolvedValue(mockUser)

      const result = await userService.getUserById(1)

      expect(result).toEqual(mockUser)
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1)
    })

    it('should throw error if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null)

      await expect(userService.getUserById(999)).rejects.toThrow('User not found')
    })
  })

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        role: 'viewer',
      }

      const mockRole = { id: 3, name: 'viewer' }
      const mockCreatedUser = {
        id: 1,
        username: 'newuser',
        email: 'new@example.com',
        role_id: 3,
      }

      mockUserRepository.existsByUsernameOrEmail.mockResolvedValue(false)
      mockRoleRepository.findByName.mockResolvedValue(mockRole)
      bcrypt.hash.mockResolvedValue('hashedPassword')
      mockUserRepository.create.mockResolvedValue(mockCreatedUser)
      mockUserRepository.findById.mockResolvedValue({
        ...mockCreatedUser,
        role: 'viewer',
      })

      const result = await userService.createUser(userData, 1)

      expect(result).toHaveProperty('id')
      expect(result.username).toBe('newuser')
      expect(mockUserRepository.create).toHaveBeenCalled()
    })

    it('should throw error if username or email already exists', async () => {
      const userData = {
        username: 'existing',
        email: 'existing@example.com',
        password: 'password123',
        role: 'viewer',
      }

      mockUserRepository.existsByUsernameOrEmail.mockResolvedValue(true)

      await expect(userService.createUser(userData, 1)).rejects.toThrow('Username or email already exists')
    })
  })

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = 1
      const userData = {
        username: 'updateduser',
        email: 'updated@example.com',
        role: 'editor',
      }

      const mockExistingUser = {
        id: 1,
        username: 'olduser',
        email: 'old@example.com',
        role_id: 3,
      }

      const mockRole = { id: 2, name: 'editor' }
      const mockUpdatedUser = {
        ...mockExistingUser,
        username: 'updateduser',
        email: 'updated@example.com',
        role_id: 2,
      }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)
      mockUserRepository.existsByUsernameOrEmail.mockResolvedValue(false)
      mockRoleRepository.findByName.mockResolvedValue(mockRole)
      mockUserRepository.update.mockResolvedValue(mockUpdatedUser)
      mockUserRepository.findById.mockResolvedValue({
        ...mockUpdatedUser,
        role: 'editor',
      })

      const result = await userService.updateUser(userId, userData, 2)

      expect(result.username).toBe('updateduser')
      expect(result.email).toBe('updated@example.com')
      expect(mockUserRepository.update).toHaveBeenCalled()
    })

    it('should throw error if trying to update own account', async () => {
      const userId = 1
      const userData = {
        username: 'updateduser',
        email: 'updated@example.com',
        role: 'editor',
      }

      const mockExistingUser = {
        id: 1,
        username: 'olduser',
        email: 'old@example.com',
        role_id: 3,
      }

      mockUserRepository.findById.mockResolvedValue(mockExistingUser)

      await expect(userService.updateUser(userId, userData, 1)).rejects.toThrow('Cannot modify your own account through this endpoint')
    })
  })

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 1
      const mockUser = { id: 1, username: 'testuser' }

      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.delete.mockResolvedValue(mockUser)

      const result = await userService.deleteUser(userId, 2)

      expect(result).toEqual({ id: 1 })
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should throw error if trying to delete own account', async () => {
      const userId = 1
      const mockUser = { id: 1, username: 'testuser' }

      mockUserRepository.findById.mockResolvedValue(mockUser)

      await expect(userService.deleteUser(userId, 1)).rejects.toThrow('Cannot delete your own account')
    })
  })
})
