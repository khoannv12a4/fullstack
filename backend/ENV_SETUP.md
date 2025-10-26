# Environment Variables Setup

## Development (Local)

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Hoặc trên Windows:
```powershell
copy .env.example .env
```

Sau đó chỉnh sửa các giá trị trong `.env` cho phù hợp.

## Production (Render, Railway, Fly.io, etc.)

Khi deploy lên platform, **KHÔNG** commit file `.env` lên Git. Thay vào đó, set các biến môi trường trực tiếp trên dashboard của platform.

### Required Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://mongo:27017/fullstack` hoặc `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | Random 32+ character string |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | Random 32+ character string |
| `JWT_EXPIRES_IN` | JWT token expiry time | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry time | `7d` |
| `CORS_ORIGIN` | Allowed frontend URL | `https://your-frontend.com` |

### Generating Secure Secrets:

**On Linux/Mac:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Platform-specific Setup:

#### Render.com:
1. Go to your service → Environment
2. Add each variable with its value
3. Save → Service will auto-redeploy

#### Railway.app:
1. Service → Variables
2. Add variables
3. Deploy

#### Fly.io:
```bash
fly secrets set MONGODB_URI="your-connection-string"
fly secrets set JWT_SECRET="your-secret"
fly secrets set JWT_REFRESH_SECRET="your-refresh-secret"
```

#### Docker Compose:
Set variables in `docker-compose.yml` under `environment` section.

## Security Notes:

1. ⚠️ **NEVER** commit `.env` file to Git
2. ⚠️ **ALWAYS** use different secrets for production
3. ⚠️ Use MongoDB Atlas for production (not local MongoDB)
4. ⚠️ Set `CORS_ORIGIN` to your actual frontend URL (not `*`)
5. ⚠️ Use environment-specific configurations

## Validation:

The application will automatically validate required environment variables on startup in production mode. If any required variable is missing, the app will exit with an error message.
