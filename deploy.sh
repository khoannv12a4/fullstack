#!/bin/bash

echo "==================================="
echo "Full Stack Deployment Script"
echo "==================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Stop any running containers
echo ""
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional)
read -p "Do you want to remove old images? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing old images..."
    docker-compose down --rmi all
fi

# Build and start containers
echo ""
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check container status
echo ""
echo "📊 Container Status:"
docker-compose ps

# Show logs
echo ""
echo "📝 Recent logs:"
docker-compose logs --tail=50

echo ""
echo "==================================="
echo "✅ Deployment Complete!"
echo "==================================="
echo ""
echo "Access your application at:"
echo "  Frontend: http://localhost:3001"
echo "  Backend:  http://localhost:3000/api"
echo ""
echo "To view logs in real-time, run:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the application, run:"
echo "  docker-compose down"
echo ""