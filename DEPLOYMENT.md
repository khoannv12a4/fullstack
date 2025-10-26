# Full Stack Application - Docker Deployment

## Yêu cầu
- Docker Desktop đã cài đặt
- Docker Compose

## Cách chạy

### 1. Build và chạy tất cả services
```bash
docker-compose up --build
```

### 2. Chạy ở chế độ background (detached)
```bash
docker-compose up -d --build
```

### 3. Xem logs
```bash
# Xem tất cả logs
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### 4. Dừng services
```bash
docker-compose down
```

### 5. Dừng và xóa volumes (xóa dữ liệu database)
```bash
docker-compose down -v
```

## Truy cập

Sau khi chạy thành công:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **MongoDB**: mongodb://localhost:27017

## Deploy lên Production

### Option 1: Deploy lên VPS/Server
1. Copy toàn bộ project lên server
2. Cài Docker và Docker Compose trên server
3. Cấu hình firewall mở port 80, 443
4. Sử dụng Nginx reverse proxy
5. Cài SSL certificate (Let's Encrypt)

### Option 2: Deploy lên Cloud Platform
- **AWS**: ECS, EC2, Elastic Beanstalk
- **Google Cloud**: Cloud Run, GKE
- **Azure**: Container Instances, AKS
- **DigitalOcean**: App Platform, Droplets
- **Heroku**: Container Registry
- **Render**: Docker deployment
- **Railway**: Docker support
- **Fly.io**: Docker deployment

### Option 3: Sử dụng Docker Hub
1. Build images:
```bash
docker build -t yourusername/fullstack-backend:latest ./backend
docker build -t yourusername/fullstack-frontend:latest ./frontend
```

2. Push lên Docker Hub:
```bash
docker push yourusername/fullstack-backend:latest
docker push yourusername/fullstack-frontend:latest
```

3. Pull và chạy trên server:
```bash
docker pull yourusername/fullstack-backend:latest
docker pull yourusername/fullstack-frontend:latest
docker-compose up -d
```

## Lưu ý quan trọng

1. **Thay đổi JWT secrets** trong docker-compose.yml trước khi deploy production
2. **Cấu hình CORS** cho phù hợp với domain của bạn
3. **Sử dụng environment variables** cho các thông tin nhạy cảm
4. **Backup database** định kỳ
5. **Setup monitoring và logging** cho production
6. **Sử dụng HTTPS** khi deploy production

## Troubleshooting

### Container không start
```bash
docker-compose logs [service-name]
```

### Xóa tất cả và rebuild
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Database connection issues
Kiểm tra MONGODB_URI trong docker-compose.yml phải đúng với tên service (mongo)

## Nâng cấp Production

Tạo file `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  backend:
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
  frontend:
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${API_URL}
```

Chạy với:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```