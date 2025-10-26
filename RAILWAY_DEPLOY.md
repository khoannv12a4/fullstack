# Deploy Full Stack Application lên Railway.app

## Bước 1: Chuẩn bị

1. Tạo tài khoản tại https://railway.app
2. Cài Railway CLI (tùy chọn):
```bash
npm install -g @railway/cli
```

## Bước 2: Push code lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

## Bước 3: Deploy trên Railway Dashboard

### A. Tạo MongoDB Database

1. Vào Railway Dashboard
2. Click **"New Project"**
3. Chọn **"Add Database"** → **MongoDB**
4. Railway sẽ tự động tạo database và cung cấp connection string
5. Copy biến `MONGO_URL` (hoặc `DATABASE_URL`)

### B. Deploy Backend

1. Trong cùng project, click **"New Service"** → **"GitHub Repo"**
2. Chọn repository của bạn
3. Railway sẽ tự động detect Dockerfile
4. Click **"Add variables"** và thêm:
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=${{MongoDB.MONGO_URL}}
   JWT_SECRET=your-random-secret-key-here
   JWT_REFRESH_SECRET=your-random-refresh-secret-key-here
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-url.railway.app
   ```
5. Trong **Settings** → **Root Directory**, set: `backend`
6. Deploy sẽ tự động chạy
7. Copy **public URL** của backend (ví dụ: `https://backend-production-xxxx.railway.app`)

### C. Deploy Frontend

1. Click **"New Service"** → **"GitHub Repo"**
2. Chọn cùng repository
3. Click **"Add variables"** và thêm:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   ```
4. Trong **Settings** → **Root Directory**, set: `frontend`
5. Deploy sẽ tự động chạy
6. Copy **public URL** của frontend

### D. Cập nhật CORS

1. Quay lại backend service
2. Update biến `CORS_ORIGIN` với URL frontend vừa có
3. Redeploy backend

## Bước 4: Deploy bằng Railway CLI (Tùy chọn)

```bash
# Login
railway login

# Link project
railway link

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../frontend
railway up
```

## Bước 5: Custom Domain (Tùy chọn)

1. Vào Settings của service
2. Click **"Generate Domain"** hoặc **"Custom Domain"**
3. Thêm domain của bạn và cấu hình DNS

## Lưu ý quan trọng

### Environment Variables trên Railway

Backend cần:
- `MONGODB_URI`: Tự động từ MongoDB service
- `JWT_SECRET`: Tạo random string an toàn
- `JWT_REFRESH_SECRET`: Tạo random string an toàn  
- `CORS_ORIGIN`: URL của frontend
- `PORT`: 3000 (Railway tự động detect)

Frontend cần:
- `NEXT_PUBLIC_API_URL`: URL của backend + `/api`

### Tạo JWT Secret an toàn

```bash
# Trên Linux/Mac
openssl rand -base64 32

# Trên Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Railway Pricing

- **Free Tier**: $5 credit/tháng (đủ cho demo và testing)
- **Hobby**: $5/tháng + usage
- **Pro**: $20/tháng + usage

### Auto Deploy

Railway tự động deploy khi bạn push code lên GitHub branch đã connect.

## Troubleshooting

### 1. Build failed
- Kiểm tra Dockerfile có đúng không
- Kiểm tra Root Directory đã set đúng chưa (backend/frontend)

### 2. Database connection error
- Kiểm tra `MONGODB_URI` variable
- Dùng reference: `${{MongoDB.MONGO_URL}}`

### 3. CORS error
- Kiểm tra `CORS_ORIGIN` trong backend
- Phải match với frontend URL

### 4. API không connect
- Kiểm tra `NEXT_PUBLIC_API_URL` trong frontend
- Phải có `/api` ở cuối

## Alternative: Deploy từ Template

Railway có thể deploy từ template:

1. Tạo file `railway.json` ở root:
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## Monitoring

- Xem logs: Railway Dashboard → Service → Logs
- Metrics: Dashboard hiển thị CPU, Memory, Network
- Alerts: Settings → Notifications

## Backup Database

Railway MongoDB có auto backup, hoặc export manual:
```bash
railway run mongodump --uri=$MONGO_URL
```