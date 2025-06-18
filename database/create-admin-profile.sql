-- First, get your user ID from auth.users table
-- Replace 'your-email@example.com' with your actual email
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'your-email@example.com';

-- Once you have the user ID, create the admin profile
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from the query above
INSERT INTO profiles (id, email, full_name, role) 
VALUES (
  '54b36ffb-be0d-4312-b6bb-bb0c78a80eb1',
  'davidkiely97@gmail.com', 
  'Admin User',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Admin User';

-- Manually confirm the email if needed (optional)
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE id = 'YOUR_USER_ID_HERE';