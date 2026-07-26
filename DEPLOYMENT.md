# Deployment Configuration for Render & Vercel

## 🚀 Render (Backend) Environment Variables

Set these in Render dashboard → Your Service → Environment tab:

### Required Variables
```
NODE_ENV=production
MONGO_URI=mongodb+srv://ahironsharma08_db_user:YOUR_PASSWORD@cluster0.3obfcs9.mongodb.net/doctor-appointment-db
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

### CORS Configuration
```
CLIENT_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Security & Rate Limiting
```
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOGIN_RATE_LIMIT_MAX=10
SIGNUP_RATE_LIMIT_MAX=5
CONTENT_SECURITY_POLICY=default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'
```

### Cloudinary (Image Uploads)
```
CLOUDINARY_CLOUD_NAME=df6ucvwym
CLOUDINARY_API_KEY=553851869162866
CLOUDINARY_API_SECRET=s1ddJAhgwBnC56RqTlVtwOI3fvQ
```

### Logging (Optional)
```
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

**Render Settings:**
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Port**: Automatically set by Render (use `process.env.PORT`)

---

## ▲ Vercel (Frontend) Environment Variables

Set these in Vercel dashboard → Your Project → Settings → Environment Variables:

### Required Variables
```
VITE_API_URL=https://your-app.onrender.com
```

**Vercel Settings:**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## 📋 Deployment Steps

### 1. Deploy Backend to Render
1. Go to https://render.com → New Web Service
2. Connect GitHub repo: `ahiron08/MediBook`
3. Set Root Directory to `server`
4. Add all environment variables listed above
5. Deploy and copy your Render URL (e.g., `https://doctor-appointment-api.onrender.com`)

### 2. Deploy Frontend to Vercel
1. Go to https://vercel.com → Import Project
2. Select your GitHub repo
3. Set `VITE_API_URL` to your Render URL
4. Deploy and copy your Vercel URL (e.g., `https://doctor-appointment.vercel.app`)

### 3. Update CORS Settings
1. Go back to Render
2. Update `CLIENT_URL` and `ALLOWED_ORIGINS` with your Vercel URL
3. Redeploy Render service

---

## 🔒 Security Notes

- ✅ `.env` files are in `.gitignore` - never committed
- ✅ Use strong JWT_SECRET (64+ characters)
- ✅ MongoDB Atlas should whitelist Render IPs
- ✅ Enable 2FA on all platforms

---

## 🆘 Troubleshooting

### "Route not found" error
- Backend not deployed → Deploy to Render first
- `VITE_API_URL` not set → Add it in Vercel
- CORS mismatch → Update `CLIENT_URL` and `ALLOWED_ORIGINS` in Render

### CORS errors
- Ensure `CLIENT_URL` matches your Vercel URL exactly
- No trailing slashes
- Include both HTTP and HTTPS if needed

### MongoDB connection issues
- Whitelist Render IPs in MongoDB Atlas
- Use standard connection string if DNS issues persist