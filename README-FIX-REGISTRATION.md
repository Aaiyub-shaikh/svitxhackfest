# Fix Registration Database Error

## Problem
You're getting a "new row violates row-level security policy for table" error during user registration.

## Root Cause
The Supabase database has Row Level Security (RLS) enabled but lacks proper policies to allow authenticated users to insert their profile data.

## Solution

### Step 1: Apply Database Policies
1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `fix-rls-policies.sql` into the SQL Editor
4. Click **Run** to execute all the SQL commands

### Step 2: Verify the Fix
1. Make sure your app is running: `npm run dev`
2. Navigate to either `/farmer` or `/buyer` in your browser
3. Try registering a new account with:
   - Valid email address
   - Strong password (at least 6 characters)
   - Fill in all required fields

### What the SQL Script Does

1. **Enables RLS** on all profile tables (if not already enabled)
2. **Creates INSERT policies** that allow users to create their own profiles
3. **Creates SELECT policies** that allow users to read their own profiles  
4. **Creates UPDATE/DELETE policies** for profile management
5. **Handles relationship constraints** between main profiles and type-specific profiles

### Key Changes Made

#### Database Policies
- Users can now insert records into `profiles` table with their own `user_id`
- Users can insert into `farmer_profiles` and `buyer_profiles` if they own the linked profile
- All operations are restricted to the authenticated user's own data

#### Code Improvements
- Better error handling in the registration flow
- Proper error propagation from database operations
- Added timeout handling for user creation
- Improved profile creation sequence

### Testing Different Scenarios

1. **Farmer Registration**:
   - Go to `/farmer`
   - Fill in: Name, Farm Name, Location, Farm Size, Phone, Email, Password
   - Should show "Registration successful!" message

2. **Buyer Registration**:
   - Go to `/buyer`  
   - Fill in: Name, Company Name, Phone, Email, Password
   - Should show "Registration successful!" message

3. **Login**:
   - Toggle to login mode
   - Use registered credentials
   - Should redirect to dashboard

### Common Issues and Solutions

**Issue**: Still getting RLS policy errors
**Solution**: Make sure you ran ALL the SQL commands in the script. Check the Supabase logs for specific table names.

**Issue**: "User creation failed"
**Solution**: Check that your email is valid and password meets requirements (6+ characters).

**Issue**: Profile creation timeout
**Solution**: This is usually a network issue. Try again or check your Supabase connection.

**Issue**: Type-specific profile creation fails
**Solution**: Ensure all required fields are filled (farm details for farmers, company name for buyers).

### Development Notes

- The app uses JWT tokens for authentication
- Profile creation happens immediately after user signup
- RLS policies ensure data isolation between users
- The registration flow creates multiple related records in sequence

If you continue to have issues, check the browser developer console and Supabase logs for specific error messages.