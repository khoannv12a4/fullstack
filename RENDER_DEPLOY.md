# Deploy Full Stack Application lên Render.com

## Tại sao chọn Render?
- ✅ **Hoàn toàn miễn phí** cho web services và databases
- ✅ **Không cần credit card** (khác với Fly.io)
- ✅ **Auto deploy** từ GitHub
- ✅ **SSL miễn phí** 
- ✅ **Setup đơn giản** như Railway
- ⚠️ **Lưu ý**: Service sẽ sleep sau 15 phút không dùng (restart ~30s)

## Bước 1: Chuẩn bị

1. Tạo tài khoản tại: https://render.com
2. Sign up bằng GitHub account
3. Verify email

## Bước 2: Tạo MongoDB Database

1. Trong Render Dashboard → **New +** → **MongoDB**
2. Chọn **Free tier** (512MB)
3. Đặt tên: `fullstack-mongo`
4. Click **Create Database**
5. Đợi vài phút để database được provisioned
6. Copy **Internal Connection String** (dạng: `mongodb://...`)

## Bước 3: Deploy Backend

1. **New +** → **Web Service**
2. Connect GitHub repository: `fullstack`
3. Cấu hình:
   ```
   Name: fullstack-backend
   Region: Oregon (US West) hoặc gần bạn nhất
   Branch: main
   Root Directory: backend
   Runtime: Docker
   Instance Type: Free
   ```

4. **Environment Variables** - Add các biến sau:
   
   **⚠️ Quan trọng: Phải set đúng tên biến**
   
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `MONGODB_URI` | Paste connection string từ MongoDB ở Bước 2 |
   | `JWT_SECRET` | `render_secret_key_12345_change_this` |
   | `JWT_REFRESH_SECRET` | `render_refresh_key_67890_change_this` |
   | `JWT_EXPIRES_IN` | `15m` |
   | `JWT_REFRESH_EXPIRES_IN` | `7d` |
   | `CORS_ORIGIN` | `*` (update sau khi có frontend URL) |
   
   💡 **Tip**: Generate secure secrets:
   ```powershell
   # Windows PowerShell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

5. Click **Create Web Service**
6. Đợi deploy xong (~3-5 phút)
7. Copy **Service URL** (ví dụ: `https://fullstack-backend-xxxx.onrender.com`)

## Bước 4: Deploy Frontend

1. **New +** → **Web Service**
2. Connect cùng repository: `fullstack`
3. Cấu hình:
   ```
   Name: fullstack-frontend
   Region: Oregon (US West)
   Branch: main
   Root Directory: frontend
   Runtime: Docker
   Instance Type: Free
   ```

4. **Environment Variables**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://fullstack-backend-xxxx.onrender.com/api
   ```
   (Thay `fullstack-backend-xxxx.onrender.com` bằng URL backend từ bước 3)

5. Click **Create Web Service**
6. Đợi deploy xong (~3-5 phút)
7. Copy **Service URL** của frontend

## Bước 5: Cập nhật CORS

1. Quay lại **Backend service**
2. Settings → Environment
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://fullstack-frontend-xxxx.onrender.com
   ```
4. Save changes → Service sẽ tự động redeploy

## Bước 6: Kiểm tra

1. Truy cập frontend URL
2. Test đăng nhập/đăng ký
3. Kiểm tra kết nối database

## Troubleshooting

### Service không start
- Vào Logs tab xem lỗi chi tiết
- Kiểm tra Dockerfile có đúng không
- Verify Root Directory đã set đúng

### Database connection error
- Kiểm tra MONGODB_URI có đúng format
- MongoDB service phải ở trạng thái "Available"
- Check IP whitelist (nên để Allow All)

### CORS error
- Kiểm tra CORS_ORIGIN match với frontend URL
- Không có trailing slash ở cuối URL
- Protocol phải là https://

### Service bị sleep
- Free tier sẽ sleep sau 15 phút không dùng
- Lần đầu truy cập sau khi sleep mất ~30s để wake up
- Nếu muốn always-on, cần upgrade lên paid plan ($7/month)

## MongoDB Atlas Alternative (Khuyến nghị)

Nếu muốn MongoDB tốt hơn và ổn định hơn:

1. Tạo tài khoản tại: https://www.mongodb.com/cloud/atlas
2. Tạo Free Cluster (M0 - 512MB)
3. Setup user và whitelist IP (0.0.0.0/0 để cho phép all)
4. Copy Connection String
5. Dùng connection string này cho MONGODB_URI ở backend

MongoDB Atlas free tier:
- 512MB storage
- Shared RAM
- Không sleep
- Backup tự động

## Auto Deploy từ GitHub

Render tự động deploy khi bạn push code:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render sẽ tự động detect changes và deploy lại services.

## Monitoring

- **Logs**: Xem real-time logs trong Logs tab
- **Metrics**: CPU, Memory, Request count
- **Events**: Deploy history và status

## Custom Domain (Free)

1. Vào Settings → Custom Domain
2. Add domain của bạn
3. Config DNS theo hướng dẫn
4. SSL tự động provision

## Cost

- **Free tier limits**:
  - 750 hours/month per service
  - 100GB bandwidth/month
  - Services sleep after 15 min inactivity
  
- **Paid plans** (nếu cần):
  - Starter: $7/month (no sleep, more resources)
  - Standard: $25/month (dedicated resources)

## So sánh với Railway

| Feature | Render Free | Railway Free |
|---------|-------------|--------------|
| Credit | Miễn phí hoàn toàn | $5/tháng |
| Sleep | Có (15 min) | Có |
| MongoDB | Free 512MB | Add-on $5/mo |
| Bandwidth | 100GB | Included |
| Deploy | Auto from GitHub | Auto from GitHub |
| SSL | Free | Free |
| Credit Card | Không cần | Không cần |

## Kết luận

Render là lựa chọn tốt nhất nếu:
- ✅ Bạn cần solution hoàn toàn free
- ✅ Không muốn dùng credit card
- ✅ App của bạn có thể chấp nhận sleep (demo, portfolio)

Nếu cần production-grade:
- Dùng MongoDB Atlas (free + stable)
- Upgrade Render services lên Starter plan
- Hoặc chuyển sang Railway, Fly.io với credit card
