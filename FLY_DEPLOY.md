# Deploy lên Fly.io (Alternative Free Option)

## Ưu điểm của Fly.io
- ✅ **3 VMs miễn phí** (256MB RAM mỗi VM)
- ✅ **Không sleep** như Render
- ✅ **Performance tốt hơn** Render free tier
- ✅ **Global CDN** built-in
- ⚠️ **Cần credit card** để verify (không charge nếu ở free tier)

## Bước 1: Cài đặt Fly CLI

```powershell
# Cài Fly CLI trên Windows
iwr https://fly.io/install.ps1 -useb | iex

# Hoặc dùng Scoop
scoop install flyctl

# Verify
flyctl version
```

## Bước 2: Login

```powershell
fly auth login
```

Browser sẽ mở để bạn đăng nhập bằng GitHub

## Bước 3: Deploy MongoDB

Fly.io không có managed MongoDB free, dùng MongoDB Atlas:

1. Tạo account tại: https://www.mongodb.com/cloud/atlas
2. Create Free Cluster (M0)
3. Setup Database User
4. Network Access → Add IP: `0.0.0.0/0`
5. Copy Connection String

## Bước 4: Deploy Backend

```powershell
cd backend

# Tạo fly.toml config
fly launch --no-deploy

# Chọn:
# - App name: fullstack-backend (hoặc tên bạn muốn)
# - Region: Singapore/Hong Kong (gần VN nhất)
# - Would you like to set up a PostgreSQL? No
# - Would you like to set up a Redis? No
```

Fly sẽ tạo file `fly.toml`. Edit nội dung:

```toml
app = "fullstack-backend"
primary_region = "sin"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "8080"
  JWT_EXPIRES_IN = "15m"
  JWT_REFRESH_EXPIRES_IN = "7d"
  CORS_ORIGIN = "*"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

Set secrets (sensitive data):

```powershell
fly secrets set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/fullstack"
fly secrets set JWT_SECRET="your-secret-key-here"
fly secrets set JWT_REFRESH_SECRET="your-refresh-secret-here"
```

Deploy:

```powershell
fly deploy
```

Get URL:

```powershell
fly status
# Hoặc
fly apps list
```

## Bước 5: Deploy Frontend

```powershell
cd ../frontend

# Launch
fly launch --no-deploy

# Chọn region giống backend
```

Edit `fly.toml`:

```toml
app = "fullstack-frontend"
primary_region = "sin"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  NEXT_PUBLIC_API_URL = "https://fullstack-backend.fly.dev/api"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

Deploy:

```powershell
fly deploy
```

## Bước 6: Cập nhật CORS

Update CORS_ORIGIN cho backend:

```powershell
cd ../backend
fly secrets set CORS_ORIGIN="https://fullstack-frontend.fly.dev"
```

## Quản lý Apps

```powershell
# Xem logs
fly logs

# SSH vào container
fly ssh console

# Scale machines
fly scale count 2

# Stop app
fly apps destroy <app-name>
```

## Free Tier Limits

- 3 VMs shared-cpu-1x (256MB RAM)
- 3GB persistent storage
- 160GB outbound bandwidth/month

## So sánh Render vs Fly.io

| Feature | Render | Fly.io |
|---------|--------|--------|
| Credit Card | Không cần | Cần |
| Sleep | Có (15 min) | Không |
| RAM | 512MB | 256MB x 3 VMs |
| Setup | Dashboard | CLI |
| Performance | Chậm hơn | Nhanh hơn |
| MongoDB | Free 512MB | Phải dùng Atlas |

## Kết luận

**Chọn Fly.io nếu:**
- Có credit card
- Cần app không bao giờ sleep
- Muốn performance tốt
- Comfortable với CLI

**Chọn Render nếu:**
- Không có credit card
- Muốn setup qua dashboard
- Cần MongoDB free luôn
- OK với sleep 15 phút
