# Environment Setup Instructions

Since `.env` files are gitignored (as they should be for security), follow these steps to create them locally:

## Backend Environment Variables

Create `backend/.env`:

```bash
# Windows PowerShell
cd backend
Copy-Item .env.example .env

# Or manually create with these values:
DATABASE_URL=postgresql://devuser:devpassword@localhost:5432/taskmanager
DB_HOST=localhost
DB_PORT=5432
DB_USER=devuser
DB_PASSWORD=devpassword
DB_NAME=taskmanager
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Frontend Environment Variables

Create `frontend/.env`:

```bash
# Windows PowerShell
cd frontend
Copy-Item .env.example .env

# Or manually create with these values:
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## Production Environment

For production deployment, create `.env` in the project root:

```bash
# Production values
DB_USER=produser
DB_PASSWORD=<secure-password>
FRONTEND_URL=https://your-domain.com
```

## Running with Environment Variables

### Using .env files (Recommended)
```bash
# Start with Docker Compose (reads .env files automatically)
docker-compose up
```

### Using inline environment variables (Alternative)
```powershell
# Backend
cd backend
$env:DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/taskmanager"
$env:PORT="5000"
npm run dev

# Frontend
cd frontend
$env:REACT_APP_API_URL="http://localhost:5000"
npm start
```

## Security Notes

- ✅ `.env` files are in `.gitignore` - never commit them
- ✅ Use `.env.example` files as templates
- ✅ Generate strong passwords for production
- ✅ Use GitHub Secrets for CI/CD environment variables
- ✅ Rotate credentials regularly

## GitHub Secrets Setup

For CI/CD, add these secrets in GitHub Settings → Secrets:
- `DATABASE_URL` (for tests)
- `AZURE_CREDENTIALS` (for deployment)
- `ACR_USERNAME` (Azure Container Registry)
- `ACR_PASSWORD` (Azure Container Registry)
