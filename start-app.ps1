# Quick Start Script for Task Manager Application
# Run this to start all services quickly

Write-Host "🚀 Starting Task Manager Application..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Start database
Write-Host ""
Write-Host "Starting PostgreSQL database..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; docker-compose up database" -WindowStyle Normal

# Wait for database to be ready
Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start backend
Write-Host ""
Write-Host "Starting Backend API..." -ForegroundColor Yellow
$backendEnv = @(
    "`$env:DATABASE_URL='postgresql://devuser:devpassword@localhost:5432/taskmanager'",
    "`$env:PORT='5000'",
    "`$env:NODE_ENV='development'",
    "`$env:CORS_ORIGIN='http://localhost:3000'",
    "npm run dev"
) -join "; "
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; $backendEnv" -WindowStyle Normal

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend
Write-Host ""
Write-Host "Starting Frontend UI..." -ForegroundColor Yellow
$frontendEnv = @(
    "`$env:REACT_APP_API_URL='http://localhost:5000'",
    "`$env:REACT_APP_ENV='development'",
    "npm start"
) -join "; "
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; $frontendEnv" -WindowStyle Normal

# Wait for frontend to compile
Write-Host "Waiting for frontend to compile..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Summary
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Task Manager is now running!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:   http://localhost:5000" -ForegroundColor Cyan
Write-Host "🐘 Database:  localhost:5432" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Three PowerShell windows have been opened:" -ForegroundColor Yellow
Write-Host "   1. Database (Docker)" -ForegroundColor White
Write-Host "   2. Backend API" -ForegroundColor White
Write-Host "   3. Frontend UI" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop: Close all three PowerShell windows and run:" -ForegroundColor Yellow
Write-Host "   docker-compose down" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - TESTING.md - Testing guide" -ForegroundColor White
Write-Host "   - QUICKSTART.md - Quick setup" -ForegroundColor White
Write-Host "   - SETUP_COMPLETE.md - Next steps" -ForegroundColor White
Write-Host ""
Write-Host "Opening browser in 5 seconds..." -ForegroundColor Cyan
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"
