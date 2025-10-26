@echo off
echo ====================================
echo Railway.app Deployment Setup
echo ====================================
echo.

REM Check if git is initialized
if not exist .git (
    echo [*] Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit for Railway deployment"
    echo [OK] Git repository initialized
) else (
    echo [OK] Git repository already exists
)

REM Check if Railway CLI is installed
where railway >nul 2>&1
if errorlevel 1 (
    echo.
    echo [!] Railway CLI is not installed
    echo Install it with: npm install -g @railway/cli
    echo.
    echo Press any key to continue with manual deployment...
    pause >nul
) else (
    echo [OK] Railway CLI is installed
    
    REM Login to Railway
    echo.
    echo [*] Logging in to Railway...
    railway login
    
    REM Link or create project
    echo.
    echo [*] Linking Railway project...
    railway link
)

echo.
echo ====================================
echo Next Steps:
echo ====================================
echo.
echo 1. Push code to GitHub:
echo    git remote add origin https://github.com/yourusername/your-repo.git
echo    git push -u origin main
echo.
echo 2. Go to Railway Dashboard: https://railway.app/dashboard
echo.
echo 3. Create New Project -^> Deploy MongoDB
echo.
echo 4. Add Service -^> GitHub Repo -^> Select your repo
echo    - Set Root Directory: backend
echo    - Add Environment Variables:
echo      MONGODB_URI=${{MongoDB.MONGO_URL}}
echo      JWT_SECRET=^<generate-random-string^>
echo      JWT_REFRESH_SECRET=^<generate-random-string^>
echo      CORS_ORIGIN=https://your-frontend.railway.app
echo.
echo 5. Add another Service for Frontend
echo    - Set Root Directory: frontend
echo    - Add Environment Variables:
echo      NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
echo.
echo 6. Copy public URLs and update CORS_ORIGIN
echo.
echo ====================================
echo.
echo Read RAILWAY_DEPLOY.md for detailed instructions
echo.
pause