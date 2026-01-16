const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '生日祝福管理系统 API',
      version: '1.0.0',
      description: '生日祝福管理系统的后端 API 文档',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: '开发服务器',
      },
      {
        url: 'https://api.example.com',
        description: '生产服务器',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: '用户ID',
            },
            username: {
              type: 'string',
              description: '用户名',
            },
            email: {
              type: 'string',
              format: 'email',
              description: '邮箱',
            },
            role: {
              type: 'string',
              enum: ['admin', 'editor', 'viewer'],
              description: '用户角色',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: '用户名',
            },
            password: {
              type: 'string',
              format: 'password',
              description: '密码',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: '用户名',
            },
            email: {
              type: 'string',
              format: 'email',
              description: '邮箱',
            },
            password: {
              type: 'string',
              minLength: 6,
              format: 'password',
              description: '密码',
            },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: '用户名',
            },
            email: {
              type: 'string',
              format: 'email',
              description: '邮箱',
            },
            password: {
              type: 'string',
              minLength: 6,
              format: 'password',
              description: '密码',
            },
            role: {
              type: 'string',
              enum: ['admin', 'editor', 'viewer'],
              default: 'viewer',
              description: '用户角色',
            },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          required: ['username', 'email', 'role'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: '用户名',
            },
            email: {
              type: 'string',
              format: 'email',
              description: '邮箱',
            },
            role: {
              type: 'string',
              enum: ['admin', 'editor', 'viewer'],
              description: '用户角色',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            list: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' },
            },
            total: {
              type: 'integer',
              description: '总数',
            },
            page: {
              type: 'integer',
              description: '当前页码',
            },
            pageSize: {
              type: 'integer',
              description: '每页数量',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: '错误信息',
                },
                code: {
                  type: 'string',
                  description: '错误代码',
                },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        description: '字段名',
                      },
                      message: {
                        type: 'string',
                        description: '错误信息',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: '响应数据',
            },
            message: {
              type: 'string',
              description: '响应消息',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
}

const specs = swaggerJsdoc(options)

module.exports = {
  swaggerServe: swaggerUi.serve,
  swaggerSetup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: '生日祝福管理系统 API 文档',
  }),
}
