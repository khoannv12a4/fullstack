# Quick Deploy Checklist

## ✅ Trước khi deploy

- [ ] Code đã được test local
- [ ] `.env` file KHÔNG được commit (check `.gitignore`)
- [ ] Dependencies đã được cập nhật trong `package.json`
- [ ] Dockerfile hoạt động đúng

## 🔧 Environment Variables cần set

### Backend (Required):
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`
- [ ] `MONGODB_URI` (connection string)
- [ ] `JWT_SECRET` (random 32+ chars)
- [ ] `JWT_REFRESH_SECRET` (random 32+ chars)
- [ ] `JWT_EXPIRES_IN=15m`
- [ ] `JWT_REFRESH_EXPIRES_IN=7d`
- [ ] `CORS_ORIGIN` (frontend URL)

### Frontend (Required):
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_API_URL` (backend URL + /api)

## 🚀 Deploy Steps - Render.com

### 1. Database Setup
- [ ] Create MongoDB database (Free tier)
- [ ] Copy connection string
- [ ] Test connection

### 2. Backend Deploy
- [ ] New Web Service → Connect GitHub repo
- [ ] Set Root Directory: `backend`
- [ ] Set Runtime: Docker
- [ ] Add all environment variables
- [ ] Deploy
- [ ] Copy service URL

### 3. Frontend Deploy
- [ ] New Web Service → Same repo
- [ ] Set Root Directory: `frontend`
- [ ] Set Runtime: Docker
- [ ] Add environment variables (use backend URL)
- [ ] Deploy
- [ ] Copy service URL

### 4. Update CORS
- [ ] Go back to Backend service
- [ ] Update `CORS_ORIGIN` with frontend URL
- [ ] Save (auto-redeploys)

### 5. Verification
- [ ] Backend health check: `https://backend-url/api/health`
- [ ] Frontend loads correctly
- [ ] Login/Register works
- [ ] API calls successful
- [ ] Check logs for errors

## 🐛 Common Issues & Solutions

### "MONGODB_URI is undefined"
✅ **Solution**: 
1. Check environment variables in dashboard
2. Verify variable name is exactly `MONGODB_URI` (case-sensitive)
3. Make sure there are no extra spaces
4. Redeploy after setting variables

### "Cannot connect to database"
✅ **Solution**:
1. Check MongoDB service is running
2. Verify connection string format
3. Check IP whitelist (allow 0.0.0.0/0)
4. Test connection string separately

### "CORS error"
✅ **Solution**:
1. Set `CORS_ORIGIN` to frontend URL (no trailing slash)
2. Use `https://` not `http://`
3. Make sure backend redeployed after CORS update

### "502 Bad Gateway"
✅ **Solution**:
1. Check backend logs for errors
2. Verify PORT is set to 3000
3. Check Dockerfile EXPOSE port matches
4. Wait for service to fully deploy (~2-5 min)

### Service keeps restarting
✅ **Solution**:
1. Check logs for crash errors
2. Verify all required env vars are set
3. Check database connection
4. Verify dependencies installed correctly

## 📊 Post-Deploy Monitoring

### Health Checks:
```bash
# Backend health
curl https://your-backend.onrender.com/api/health

# Should return: { "status": "OK", "database": "connected" }
```

### Logs:
- Monitor logs in Render dashboard
- Look for connection errors
- Check API request/response times

### Performance:
- First request after sleep: ~30s
- Regular requests: <1s
- Database queries: <500ms

## 🔐 Security Checklist

- [ ] JWT secrets are random and unique
- [ ] CORS_ORIGIN is set to specific domain (not `*`)
- [ ] MongoDB uses strong password
- [ ] Environment variables are not in code
- [ ] No sensitive data in logs
- [ ] HTTPS is enabled (automatic on Render)

## 💡 Pro Tips

1. **Generate secure secrets:**
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **Use MongoDB Atlas** instead of Render MongoDB for better stability

3. **Enable auto-deploy** from GitHub main branch

4. **Set up notifications** in Render for deploy failures

5. **Use environment-specific branches:**
   - `main` → production
   - `staging` → staging environment
   - `dev` → development

## 📚 Documentation Links

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

Bạn gặp vấn đề? Check [Troubleshooting section](#-common-issues--solutions) ở trên!
