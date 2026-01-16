const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals')
const { AuthService } = require('../../src/services/AuthService')
const { UserRepository } = require('../../src/repositories/UserRepository')
const bcrypt = require('bcryptjs')

jest.mock('../../src/repositories/UserRepository')
jest.mock('bcryptjs')

describe('AuthService', () => {
  let authService
  let mockUserRepository

  beforeEach(() => {
    mockUserRepository = {
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    }
    UserRepository.mockImplementation(() => mockUserRepository)
    authService = new AuthService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }

      mockUserRepository.findByUsername.mockResolvedValue(null)
      mockUserRepository.findByEmail.mockResolvedValue(null)
      bcrypt.hash.mockResolvedValue('hashedPassword')
      mockUserRepository.create.mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role_id: 3,
      })

      const result = await authService.register(userData)

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('token')
      expect(result.user.username).toBe('testuser')
      expect(result.user.email).toBe('test@example.com')
      expect(mockUserRepository.create).toHaveBeenCalled()
    })

    it('should throw error if username already exists', async () => {
      const userData = {
        username: 'existinguser',
        email: 'test@example.com',
        password: 'password123',
      }

      mockUserRepository.findByUsername.mockResolvedValue({
        id: 1,
        username: 'existinguser',
      })

      await expect(authService.register(userData)).rejects.toThrow('Username already exists')
    })

    it('should throw error if email already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
      }

      mockUserRepository.findByUsername.mockResolvedValue(null)
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'existing@example.com',
      })

      await expect(authService.register(userData)).rejects.toThrow('Email already exists')
    })
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = {
        username: 'testuser',
        password: 'password123',
      }

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedPassword',
        role_id: 3,
      }

      mockUserRepository.findByUsername.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(true)

      const result = await authService.login(credentials)

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('token')
      expect(result.user.username).toBe('testuser')
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword')
    })

    it('should throw error if user not found', async () => {
      const credentials = {
        username: 'nonexistent',
        password: 'password123',
      }

      mockUserRepository.findByUsername.mockResolvedValue(null)

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials')
    })

    it('should throw error if password is invalid', async () => {
      const credentials = {
        username: 'testuser',
        password: 'wrongpassword',
      }

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedPassword',
        role_id: 3,
      }

      mockUserRepository.findByUsername.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(false)

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials')
    })
  })
})
