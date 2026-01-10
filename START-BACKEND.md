# Start Backend Server

## Quick Start

1. **Open a new terminal window**

2. **Navigate to backend directory:**
   ```bash
   cd "C:\smart farm\khet-sahayak-web\backend"
   ```

3. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

4. **Create `.env` file** (if it doesn't exist):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=smart_farm
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRES_IN=7d
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5174
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```

6. **You should see:**
   ```
   🚀 Server running on http://localhost:3001
   📝 Environment: development
   ✅ Database connected successfully
   ```

## Verify Backend is Running

Open a browser and go to: `http://localhost:3001/health`

You should see: `{"status":"ok","message":"Smart Farm API is running"}`

## Troubleshooting

### "Cannot find module" error
- Run `npm install` in the backend directory

### "Database connection failed"
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database `smart_farm` exists

### "Port 3001 already in use"
- Another process is using port 3001
- Change PORT in `.env` to a different port (e.g., 3002)
- Update frontend API URL accordingly
