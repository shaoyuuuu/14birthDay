process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key'
process.env.DB_HOST = 'localhost'
process.env.DB_NAME = 'test_birthday_wish'
process.env.DB_USER = 'test_user'
process.env.DB_PASSWORD = 'test_password'

jest.setTimeout(10000)
