# Migration Guide: Supabase to SQL Backend

This guide explains the changes made to replace Supabase with a SQL-based backend.

## What Changed

### Backend
- ✅ Created new Express.js backend server in `/backend`
- ✅ Replaced Supabase authentication with JWT-based auth
- ✅ Replaced Supabase database with PostgreSQL
- ✅ Created SQL schema matching the original Supabase structure

### Frontend
- ✅ Replaced Supabase client calls with REST API calls
- ✅ Updated `useAuth` hook to use new API
- ✅ Maintained same interface for compatibility

## Files Modified

### Backend (New)
- `backend/server.js` - Main Express server
- `backend/database.js` - PostgreSQL connection
- `backend/routes/auth.js` - Authentication endpoints
- `backend/middleware/auth.js` - JWT authentication middleware
- `backend/database-schema.sql` - Database schema
- `backend/package.json` - Backend dependencies

### Frontend (Modified)
- `src/hooks/useAuth.ts` - Replaced Supabase calls with API calls
- `src/services/api.ts` - New API client service

### Frontend (Unchanged - Still Compatible)
- `src/components/ProtectedRoute.tsx` - Works with new auth system
- `src/components/AuthForm.tsx` - Uses useAuth hook (no changes needed)
- All other UI components - No changes needed

## Setup Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Database

1. Install PostgreSQL if not already installed
2. Create database:
   ```sql
   CREATE DATABASE smart_farm;
   ```

3. Run schema:
   ```bash
   psql -U postgres -d smart_farm -f database-schema.sql
   ```

### 3. Configure Backend

Create `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=smart_farm
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:8080
```

### 4. Start Backend Server

```bash
cd backend
npm start
```

### 5. Configure Frontend

The frontend will automatically use `http://localhost:3001/api` as the default API URL.

To customize, create a `.env` file in the project root:
```env
VITE_API_URL=http://localhost:3001/api
```

### 6. Start Frontend

```bash
npm run dev
```

## API Compatibility

The new backend maintains API response format compatibility with Supabase:

- **Sign Up**: Returns `{ data: { user, session }, error }`
- **Sign In**: Returns `{ data: { user, session }, error }`
- **Session**: Returns `{ data: { session }, error }`

This ensures the frontend works without modification.

## Differences from Supabase

1. **No Real-time**: Real-time subscriptions are not implemented
2. **JWT Tokens**: Tokens stored in localStorage instead of Supabase session storage
3. **Direct SQL**: Database queries use raw SQL instead of Supabase client methods
4. **No Email Verification**: Email verification is not implemented (can be added)

## Removing Supabase Dependencies (Optional)

After confirming everything works, you can remove Supabase:

1. Remove from `package.json`:
   ```bash
   npm uninstall @supabase/supabase-js
   ```

2. Delete Supabase integration files (optional):
   - `src/integrations/supabase/`
   - `supabase/` directory

3. Remove Supabase config from `vite.config.ts` if any

## Troubleshooting

### Backend won't start
- Check database connection settings in `.env`
- Ensure PostgreSQL is running
- Verify database exists

### Authentication fails
- Check backend is running on port 3001
- Verify CORS settings allow frontend origin
- Check JWT_SECRET is set

### Database errors
- Ensure schema is created: run `database-schema.sql`
- Check database user has proper permissions
- Verify table names match schema

## Support

If you encounter issues:
1. Check backend logs for errors
2. Verify database connection
3. Check browser console for API errors
4. Ensure environment variables are set correctly
