#!/bin/bash

echo "===================================="
echo "Railway.app Deployment Setup"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for Railway deployment"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo ""
    echo "⚠️  Railway CLI is not installed"
    echo "Install it with: npm install -g @railway/cli"
    echo ""
    read -p "Do you want to continue with manual deployment? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Railway CLI is installed"
    
    # Login to Railway
    echo ""
    echo "🔐 Logging in to Railway..."
    railway login
    
    # Link or create project
    echo ""
    echo "🔗 Linking Railway project..."
    railway link
fi

echo ""
echo "===================================="
echo "📋 Next Steps:"
echo "===================================="
echo ""
echo "1. Push code to GitHub:"
echo "   git remote add origin https://github.com/yourusername/your-repo.git"
echo "   git push -u origin main"
echo ""
echo "2. Go to Railway Dashboard: https://railway.app/dashboard"
echo ""
echo "3. Create New Project → Deploy MongoDB"
echo ""
echo "4. Add Service → GitHub Repo → Select your repo"
echo "   - Set Root Directory: backend"
echo "   - Add Environment Variables:"
echo "     MONGODB_URI=\${{MongoDB.MONGO_URL}}"
echo "     JWT_SECRET=<generate-random-string>"
echo "     JWT_REFRESH_SECRET=<generate-random-string>"
echo "     CORS_ORIGIN=https://your-frontend.railway.app"
echo ""
echo "5. Add another Service for Frontend"
echo "   - Set Root Directory: frontend"
echo "   - Add Environment Variables:"
echo "     NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api"
echo ""
echo "6. Copy public URLs and update CORS_ORIGIN"
echo ""
echo "===================================="
echo ""
echo "📚 Read RAILWAY_DEPLOY.md for detailed instructions"
echo ""