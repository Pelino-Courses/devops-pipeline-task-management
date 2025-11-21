# Quick Start Guide

This guide will help you get the Task Manager application running locally using Docker Compose.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- [Git](https://git-scm.com/) installed

## 🚀 Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/yakingi/devops-pipeline-task-manager.git
cd devops-pipeline-task-manager
```

### 2. Start the Application

```bash
# Start all services (database, backend, frontend)
docker-compose up
```

**Wait for these messages:**
- ✅ Database: `database system is ready to accept connections`
- ✅ Backend: `Server running on port 5000`
- ✅ Frontend: `webpack compiled successfully`

### 3. Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### 4. Test the Application

1. **Create a task**: Fill in the form and click "Create Task"
2. **View tasks**: See your task appear in the list below
3. **Update status**: Use the dropdown to change task status
4. **Edit task**: Click the "Edit" button
5. **Delete task**: Click the "Delete" button

### 5. Stop the Application

```bash
# Press Ctrl+C in the terminal, then:
docker-compose down
```

## 📊 What's Running?

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React application |
| Backend | 5000 | Express API |
| Database| 5432 | PostgreSQL database |

## 🔧 Development Mode

For active development with hot-reload:

```bash
# Backend development
cd backend
npm install
npm run dev

# Frontend development (new terminal)
cd frontend
npm install
npm start
```

## 📁 Sample Data

The database is initialized with 5 sample tasks:
1. Setup development environment (Done, High)
2. Create Express API (In Progress, High)
3. Implement React frontend (Todo, High)
4. Write unit tests (Todo, Medium)
5. Configure Docker (Todo, Medium)

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Check what's using the port
# Windows:
netstat -ano | findstr :3000

# Stop conflicting services or change ports in docker-compose.yml
```

**Database connection errors:**
```bash
# Restart just the database
docker-compose restart database

# Check database logs
docker-compose logs database
```

**Clear everything and start fresh:**
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Start again
docker-compose up
```

## 🧪 Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📚 API Examples

### Get all tasks
```bash
curl http://localhost:5000/api/tasks
```

### Create a task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing the API",
    "status": "todo",
    "priority": "medium"
  }'
```

### Update a task
```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

### Delete a task
```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```

## 🎯 Next Steps

Now that you have the application running:

1. ✅ **Explore the UI** - Try creating, editing, and deleting tasks
2. ✅ **Test the API** - Use the examples above or Postman
3. ⏭️ **Push to GitHub** - Commit your changes
4. ⏭️ **Set up CI/CD** - Configure GitHub Actions
5. ⏭️ **Deploy to Azure** - Provision infrastructure with Terraform

See [NEXT_STEPS.md](NEXT_STEPS.md) for the complete roadmap!

## 💡 Tips

- **Database persistence**: Task data is stored in a Docker volume and persists between restarts
- **Hot reload**: Changes to frontend code will auto-refresh the browser
- **Logs**: Use `docker-compose logs -f [service]` to see real-time logs
- **Shell access**: Use `docker-compose exec [service] sh` to access a container

## 📖 More Documentation

- [Backend README](backend/README.md) - API documentation
- [Frontend README](frontend/README.md) - Component documentation
- [Setup Guide](docs/SETUP_GUIDE.md) - Detailed setup instructions
- [Contributing](CONTRIBUTING.md) - Development guidelines

## 🆘 Need Help?

- Check [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for detailed troubleshooting
- Review Docker Compose logs: `docker-compose logs`
- Ensure all prerequisites are installed
- Verify ports 3000, 5000, and 5432 are not in use

Happy coding! 🚀
