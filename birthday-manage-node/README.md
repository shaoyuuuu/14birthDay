# Birthday Wish Backend API

Backend API for Birthday Wish project built with Node.js, Express, and PostgreSQL.

## Features

- Admin authentication (JWT-based)
- Visit tracking and statistics
- Message management
- Memory management
- Rate limiting and security headers
- Comprehensive logging

## Prerequisites

- Node.js 16+
- PostgreSQL 12+

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/birthday_wish
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

3. Run database migrations:
```bash
npm run migrate
```

4. Seed default admin user:
```bash
npm run seed
```

Default credentials:
- Username: `admin`
- Password: `admin123`

## Development

Start development server with auto-reload:
```bash
npm run dev
```

Start production server:
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Login admin
- `GET /api/auth/verify` - Verify token (requires auth)

### Visits

- `POST /api/visits` - Record visit
- `GET /api/visits` - Get all visits (requires auth)
- `GET /api/visits/stats` - Get visit statistics (requires auth)

### Messages

- `POST /api/messages` - Submit message
- `GET /api/messages` - Get all messages (requires auth)
- `PUT /api/messages/:id` - Approve/reject message (requires auth)
- `DELETE /api/messages/:id` - Delete message (requires auth)

### Memories

- `POST /api/memories` - Create memory (requires auth)
- `GET /api/memories` - Get all memories
- `GET /api/memories/:id` - Get single memory
- `PUT /api/memories/:id` - Update memory (requires auth)
- `DELETE /api/memories/:id` - Delete memory (requires auth)

## Database Schema

### admins
- id (SERIAL PRIMARY KEY)
- username (VARCHAR(50) UNIQUE)
- password_hash (VARCHAR(255))
- email (VARCHAR(255) UNIQUE)
- created_at (TIMESTAMP)

### visits
- id (SERIAL PRIMARY KEY)
- ip_address (VARCHAR(45))
- user_agent (TEXT)
- visit_date (TIMESTAMP)
- page_url (VARCHAR(255))
- referrer (TEXT)

### messages
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(100))
- email (VARCHAR(255))
- message (TEXT)
- created_at (TIMESTAMP)
- is_approved (BOOLEAN)

### memories
- id (SERIAL PRIMARY KEY)
- title (VARCHAR(255))
- description (TEXT)
- memory_content (TEXT)
- date (DATE)
- images (TEXT[])
- comment (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Deployment to Railway

详细的 Railway 部署指南请参考 [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) 文档。

快速部署步骤：
1. Push your code to GitHub
2. Create a new project on Railway
3. Connect your GitHub repository
4. Add PostgreSQL database service
5. Set environment variables in Railway dashboard
6. Deploy!

Railway will automatically:
- Install dependencies
- Run migrations
- Start the server

## Frontend Integration

前端管理面板项目位于 [birthday-manage-web](../birthday-manage-web/) 目录。

前端项目需要配置后端 API 地址才能正常工作。请参考前端项目的 [README.md](../birthday-manage-web/README.md) 了解如何配置。

## Security

- Helmet.js for security headers
- Rate limiting to prevent abuse
- JWT authentication
- Password hashing with bcrypt
- Input validation with Joi
- CORS configuration

## Logging

Logs are stored in:
- Console (all environments)
- `logs/error.log` (development)
- `logs/combined.log` (development)

## License

MIT
