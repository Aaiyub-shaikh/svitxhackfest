# Troubleshooting Guide

## Common Issues and Solutions

### 1. Frontend Won't Start

**Error: Cannot find module or import errors**

**Solution:**
```bash
cd khet-sahayak-web
npm install
npm run dev
```

### 2. Backend Connection Errors

**Error: "Network error" or "Failed to fetch"**

**Check:**
1. Is backend server running?
   ```bash
   cd backend
   npm start
   ```
   Should see: `🚀 Server running on http://localhost:3001`

2. Check backend health:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","message":"Smart Farm API is running"}`

3. Check CORS settings in `backend/server.js`
   - Frontend URL should be: `http://localhost:8080`

### 3. Database Connection Errors

**Error: "Database connection failed" or "Connection refused"**

**Check:**
1. Is PostgreSQL running?
   ```bash
   # Windows
   # Check Services for PostgreSQL
   
   # Mac/Linux
   pg_isready
   ```

2. Verify database exists:
   ```bash
   psql -U postgres -l
   ```
   Look for `smart_farm` database

3. Check `.env` file in `backend/` directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_actual_password
   DB_NAME=smart_farm
   ```

4. Test connection:
   ```bash
   psql -U postgres -d smart_farm -c "SELECT 1;"
   ```

### 4. Authentication Errors

**Error: "Invalid token" or "Session not found"**

**Solution:**
1. Clear browser localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```

2. Check JWT_SECRET in backend `.env`:
   ```env
   JWT_SECRET=your_super_secret_jwt_key
   ```

3. Verify backend is returning tokens correctly
   - Check backend logs when logging in

### 5. Schema/Table Errors

**Error: "relation does not exist" or "table not found"**

**Solution:**
1. Run database schema:
   ```bash
   cd backend
   psql -U postgres -d smart_farm -f database-schema.sql
   ```

2. Verify tables exist:
   ```sql
   psql -U postgres -d smart_farm
   \dt
   ```
   Should show: `users`, `profiles`, `farmer_profiles`, `buyer_profiles`

### 6. Port Already in Use

**Error: "Port 3001 is already in use"**

**Solution:**
1. Find process using port:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Mac/Linux
   lsof -i :3001
   ```

2. Kill the process or change port in `backend/.env`:
   ```env
   PORT=3002
   ```

3. Update frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:3002/api
   ```

### 7. Browser Console Errors

**Common errors:**

1. **"Failed to fetch"**
   - Backend not running
   - CORS issue
   - Wrong API URL

2. **"Cannot read property of undefined"**
   - Check if user data is loaded
   - Verify session endpoint returns correct format

3. **"Invalid token"**
   - Token expired
   - JWT_SECRET mismatch
   - Clear localStorage and login again

### 8. Quick Diagnostic Steps

1. **Check Backend:**
   ```bash
   cd backend
   npm start
   # Should see: "🚀 Server running on http://localhost:3001"
   ```

2. **Check Frontend:**
   ```bash
   cd khet-sahayak-web
   npm run dev
   # Should see: "Local: http://localhost:8080"
   ```

3. **Test Backend API:**
   ```bash
   curl http://localhost:3001/health
   ```

4. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for red errors
   - Check Network tab for failed requests

5. **Check Backend Logs:**
   - Look at terminal where backend is running
   - Check for database connection errors
   - Check for authentication errors

### 9. Environment Variables Checklist

**Backend (`backend/.env`):**
- [ ] DB_HOST
- [ ] DB_PORT
- [ ] DB_USER
- [ ] DB_PASSWORD
- [ ] DB_NAME
- [ ] JWT_SECRET
- [ ] PORT
- [ ] FRONTEND_URL

**Frontend (optional `.env`):**
- [ ] VITE_API_URL (defaults to http://localhost:3001/api)

### 10. Still Not Working?

1. **Check all services are running:**
   - PostgreSQL
   - Backend server (port 3001)
   - Frontend dev server (port 8080)

2. **Verify database:**
   - Database exists
   - Tables created
   - User has permissions

3. **Clear everything:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Clear browser cache and localStorage
   ```

4. **Check logs:**
   - Backend terminal output
   - Browser console
   - Network tab in DevTools
