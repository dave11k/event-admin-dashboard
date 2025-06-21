-- Update event_registrations table to store attendee information directly
-- instead of linking to dashboard users

-- First, drop the existing table (careful - this will delete data)
DROP TABLE IF EXISTS event_registrations CASCADE;

-- Create new event_registrations table with attendee information
CREATE TABLE event_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  attendee_name TEXT NOT NULL,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_name ON event_registrations(attendee_name);

-- Add a unique constraint to prevent duplicate names per event (optional)
-- ALTER TABLE event_registrations ADD CONSTRAINT unique_attendee_per_event UNIQUE(event_id, attendee_name);