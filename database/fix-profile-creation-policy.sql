-- Fix profile creation RLS policy
-- Allow users to create their own profile when they first sign up

-- Add policy to allow users to insert their own profile
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Note: This policy allows any authenticated user to create their own profile
-- The role will be set by the admin during user creation
-- This is safe because users can only create a profile with their own auth.uid()