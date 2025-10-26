@echo off
echo ===================================
echo Full Stack Deployment Script
echo ===================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo X Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Stop existing containers
echo [*] Stopping existing containers...
docker-compose down
echo.

REM Build and start containers
echo [*] Building and starting containers...
docker-compose up --build -d
echo.

REM Wait for services to start
echo [*] Waiting for services to start...
timeout /t 10 /nobreak >nul
echo.

REM Check container status
echo [*] Container Status:
docker-compose ps
echo.

REM Show logs
echo [*] Recent logs:
docker-compose logs --tail=50
echo.

echo ===================================
echo [OK] Deployment Complete!
echo ===================================
echo.
echo Access your application at:
echo   Frontend: http://localhost:3001
echo   Backend:  http://localhost:3000/api
echo.
echo To view logs in real-time, run:
echo   docker-compose logs -f
echo.
echo To stop the application, run:
echo   docker-compose down
echo.
pause