# PassGuardian Deployment Checklist

## Pre-Deployment Checklist

### 1. MongoDB Atlas Setup
- [ ] Create free cluster at mongodb.com/atlas
- [ ] Create database user (save username/password)
- [ ] Whitelist IP: `0.0.0.0/0` (or Vercel IPs)
- [ ] Get connection string

### 2. Backend Environment Variables (Vercel Dashboard)
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/passguardian
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### 3. Frontend Environment Variables (Vercel Dashboard)
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

### 4. Deploy Commands
```bash
# Backend
cd backend
vercel --prod

# Frontend
cd frontend
vercel --prod
```

### 5. Post-Deployment Verification
- [ ] API health check: `GET https://backend-url/api/health`
- [ ] Register a test account
- [ ] Login and verify JWT works
- [ ] Add a password entry
- [ ] Edit the password
- [ ] Delete the password
- [ ] Check sidebar navigation between Dashboard and Passwords
- [ ] Test search functionality
- [ ] Test category filter
- [ ] Test password generator
- [ ] Test copy to clipboard
- [ ] Test password visibility toggle
- [ ] Test responsive design on mobile

### 6. GitHub Push
```bash
git init
git add .
git commit -m "Initial commit: PassGuardian password manager"
git branch -M main
git remote add origin https://github.com/yourusername/passguardian.git
git push -u origin main
```

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in backend matches actual frontend URL
- Check Vercel deployment URL format (includes `https://`)

### MongoDB Connection Errors
- Verify `MONGODB_URI` is correct
- Check IP whitelist includes `0.0.0.0/0`
- Ensure database user has read/write permissions

### JWT Errors
- Ensure `JWT_SECRET` is at least 32 characters
- Check token isn't expired (default 7 days)

### Build Errors
- Ensure Node.js version >= 18
- Run `npm install` in both frontend and backend
- Check for missing dependencies
