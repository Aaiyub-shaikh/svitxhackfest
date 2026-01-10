-- Fix RLS Policies for Smart Farm Registration
-- Run these SQL commands in your Supabase SQL Editor

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional, only if you want to start fresh)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

DROP POLICY IF EXISTS "Users can insert their farmer profile" ON farmer_profiles;
DROP POLICY IF EXISTS "Users can view their farmer profile" ON farmer_profiles;
DROP POLICY IF EXISTS "Users can update their farmer profile" ON farmer_profiles;
DROP POLICY IF EXISTS "Users can delete their farmer profile" ON farmer_profiles;

DROP POLICY IF EXISTS "Users can insert their buyer profile" ON buyer_profiles;
DROP POLICY IF EXISTS "Users can view their buyer profile" ON buyer_profiles;
DROP POLICY IF EXISTS "Users can update their buyer profile" ON buyer_profiles;
DROP POLICY IF EXISTS "Users can delete their buyer profile" ON buyer_profiles;

-- Create new policies for profiles table
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for farmer_profiles table
CREATE POLICY "Users can insert their farmer profile" ON farmer_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = farmer_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their farmer profile" ON farmer_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = farmer_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their farmer profile" ON farmer_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = farmer_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their farmer profile" ON farmer_profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = farmer_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Create new policies for buyer_profiles table
CREATE POLICY "Users can insert their buyer profile" ON buyer_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = buyer_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their buyer profile" ON buyer_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = buyer_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their buyer profile" ON buyer_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = buyer_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their buyer profile" ON buyer_profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = buyer_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Optional: Allow public read access to profiles for marketplace functionality
-- Uncomment these if you want buyers and farmers to see each other's basic info
-- CREATE POLICY "Public can view farmer profiles" ON farmer_profiles FOR SELECT USING (true);
-- CREATE POLICY "Public can view buyer profiles" ON buyer_profiles FOR SELECT USING (true);
-- CREATE POLICY "Public can view basic profiles" ON profiles FOR SELECT USING (true);

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'farmer_profiles', 'buyer_profiles')
ORDER BY tablename, policyname;