-- Insert sample events (these will match your existing mock data)
INSERT INTO events (id, title, description, date, location, capacity, status, price, created_at) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Annual Tech Conference 2024',
  'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.',
  '2024-07-15 09:00:00+00',
  'San Francisco Convention Center',
  500,
  'upcoming',
  299.99,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Startup Pitch Night',
  'Watch promising startups pitch their ideas to a panel of experienced investors.',
  '2024-06-20 18:00:00+00',
  'Innovation Hub Downtown',
  150,
  'upcoming',
  50.00,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Web Development Workshop',
  'Hands-on workshop covering modern web development practices and frameworks.',
  '2024-05-25 10:00:00+00',
  'Tech Learning Center',
  50,
  'completed',
  75.00,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'AI and Machine Learning Summit',
  'Explore the latest advancements in artificial intelligence and machine learning.',
  '2024-08-10 08:30:00+00',
  'University Conference Hall',
  300,
  'upcoming',
  199.99,
  NOW()
);

-- Note: We'll create sample users and registrations after auth is set up
-- This is because we need actual authenticated users to create proper profiles