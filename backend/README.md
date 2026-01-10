# Smart Farm Backend API

This backend replaces Supabase with a SQL-based authentication system using PostgreSQL, Express, and JWT.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

#### Option A: Using PostgreSQL

1. Install PostgreSQL if not already installed
2. Create a database:
   ```sql
   CREATE DATABASE smart_farm;
   ```

3. Run the schema:
   ```bash
   psql -U postgres -d smart_farm -f database-schema.sql
   ```

#### Option B: Using MySQL (Alternative)

If you prefer MySQL, you'll need to:
1. Modify `database.js` to use `mysql2` instead of `pg`
2. Convert the SQL schema to MySQL syntax (change UUID to CHAR(36), etc.)

### 3. Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=smart_farm

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### 4. Start the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout user
- `GET /api/auth/session` - Get current session

### Health Check

- `GET /health` - Server health check

## Frontend Configuration

Update your frontend `.env` file (or `vite.config.ts`) to point to the backend:

```env
VITE_API_URL=http://localhost:3001/api
```

## Migration from Supabase

This backend maintains API compatibility with the Supabase client format, so the frontend should work without major changes. The main differences:

1. **Authentication**: Uses JWT tokens stored in localStorage instead of Supabase sessions
2. **Database**: Direct SQL queries instead of Supabase client methods
3. **No Real-time**: Real-time subscriptions are not implemented (can be added if needed)

## Security Notes

- Change `JWT_SECRET` to a strong random string in production
- Use HTTPS in production
- Consider adding rate limiting for authentication endpoints
- Implement password strength requirements
- Add email verification if needed
