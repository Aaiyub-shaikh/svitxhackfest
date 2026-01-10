# Quick Start Guide - SQL Backend Setup

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Step 1: Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**
   ```bash
   # Login to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE smart_farm;
   
   # Exit psql
   \q
   ```

3. **Run Schema**
   ```bash
   cd khet-sahayak-web/backend
   psql -U postgres -d smart_farm -f database-schema.sql
   ```

## Step 2: Backend Setup

1. **Install Dependencies**
   ```bash
   cd khet-sahayak-web/backend
   npm install
   ```

2. **Create Environment File**
   ```bash
   # Copy example file
   cp .env.example .env
   
   # Edit .env with your database credentials
   ```

3. **Update `.env` file:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_actual_password
   DB_NAME=smart_farm
   JWT_SECRET=change_this_to_a_random_string
   JWT_EXPIRES_IN=7d
   PORT=3001
   FRONTEND_URL=http://localhost:8080
   ```

4. **Start Backend Server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   You should see: `🚀 Server running on http://localhost:3001`

## Step 3: Frontend Setup

1. **Install Dependencies** (if not already done)
   ```bash
   cd khet-sahayak-web
   npm install
   ```

2. **Start Frontend** (in a new terminal)
   ```bash
   npm run dev
   ```

   Frontend will run on: `http://localhost:8080`

## Step 4: Test Authentication

1. Open browser: `http://localhost:8080`
2. Click "Continue as Farmer" or "Continue as Buyer"
3. Click "Don't have an account? Register"
4. Fill in registration form
5. Submit and verify registration works
6. Login with your credentials
7. Verify you can access protected routes

## Troubleshooting

### Backend won't start
- ✅ Check PostgreSQL is running: `pg_isready`
- ✅ Verify database exists: `psql -U postgres -l`
- ✅ Check `.env` file has correct credentials
- ✅ Ensure port 3001 is not in use

### Database connection errors
- ✅ Verify PostgreSQL is running
- ✅ Check database credentials in `.env`
- ✅ Ensure database `smart_farm` exists
- ✅ Verify user has permissions

### Frontend can't connect to backend
- ✅ Check backend is running on port 3001
- ✅ Verify CORS settings in `backend/server.js`
- ✅ Check browser console for errors
- ✅ Verify `VITE_API_URL` if set in frontend `.env`

### Authentication not working
- ✅ Check backend logs for errors
- ✅ Verify JWT_SECRET is set
- ✅ Check database tables exist (run schema again)
- ✅ Clear browser localStorage and try again

## Verification Checklist

- [ ] PostgreSQL is installed and running
- [ ] Database `smart_farm` exists
- [ ] Schema has been applied (tables exist)
- [ ] Backend `.env` is configured
- [ ] Backend server starts without errors
- [ ] Frontend can connect to backend
- [ ] User registration works
- [ ] User login works
- [ ] Protected routes work
- [ ] Logout works

## Next Steps

After setup is complete:
1. Change `JWT_SECRET` to a strong random string
2. Set up production environment variables
3. Configure HTTPS for production
4. Set up database backups
5. (Optional) Remove Supabase dependencies from `package.json`
