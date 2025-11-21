# Backend - Task Manager API

Node.js/Express REST API for the DevOps Pipeline Task Manager application.

## 🏗️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Testing**: Jest + Supertest
- **Linting**: ESLint

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection pool
│   ├── controllers/
│   │   └── taskController.js    # Request handlers
│   ├── database/
│   │   ├── schema.sql            # Database schema
│   │   └── migrate.js            # Migration script
│   ├── middleware/
│   │   └── errorHandler.js      # Error handling middleware
│   ├── models/
│   │   └── Task.js              # Task model with CRUD operations
│   ├── routes/
│   │   └── taskRoutes.js        # API route definitions
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server entry point
├── tests/
│   ├── api.test.js              # API endpoint tests
│   ├── task.model.test.js       # Model unit tests
│   └── task.controller.test.js  # Controller integration tests
├── .env.example                 # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── Dockerfile                   # Docker container definition
├── healthcheck.js              # Health check script
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+ (or use Docker Compose)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up database**:
   ```bash
   # Create PostgreSQL database
   createdb taskmanager
   
   # Run migrations
   npm run migrate
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Tasks
- `GET /api/tasks` - Get all tasks (optional `?status=todo` filter)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Example: Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Setup CI/CD",
    "description": "Configure GitHub Actions",
    "status": "todo",
    "priority": "high"
  }'
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

**Test Coverage:**
- Unit tests: Task model (6 tests)
- Integration tests: API endpoints (10 tests)
- Health check tests (2 tests)

## 🔍 Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

## 🐳 Docker

```bash
# Build image
docker build -t taskmanager-backend .

# Run container
docker run -p 5000:5000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  taskmanager-backend
```

## 📊 Database Schema

### Tasks Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| title | VARCHAR(255) | Task title (required) |
| description | TEXT | Task description |
| status | VARCHAR(50) | todo, in-progress, done |
| priority | VARCHAR(20) | low, medium, high |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## 🔧 npm Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |
| `npm run migrate` | Run database migrations |

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |

## 🛠️ Development

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Add routes in `src/routes/`
3. Register routes in `src/app.js`
4. Write tests in `tests/`

### Code Style

- Use ESLint recommended rules
- 2-space indentation
- Single quotes for strings
- Semicolons required

## 🐛 Troubleshooting

**Database connection fails:**
```bash
# Check PostgreSQL is running
pg_isready

# Verify connection string
echo $DATABASE_URL
```

**Tests fail:**
```bash
# Clear Jest cache
npm test -- --clearCache
```

## 📝 Next Steps

- ✅ Basic CRUD operations
- ✅ Input validation
- ✅ Error handling
- ✅ Unit and integration tests
- ⏭️ Add authentication (JWT)
- ⏭️ Add pagination
- ⏭️ Add task assignments
- ⏭️ Add due dates

## 📄 License

MIT License - See project root LICENSE file
