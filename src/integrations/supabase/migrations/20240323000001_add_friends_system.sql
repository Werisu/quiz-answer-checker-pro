-- Migration: Add Friends System
-- Date: 2024-03-23
-- Description: Implements the basic friendship system with status tracking

-- Create friendship status enum
CREATE TYPE friendship_status AS ENUM
('pending', 'accepted', 'rejected', 'blocked');

-- Create friendships table
CREATE TABLE friendships
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status friendship_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(requester_id, addressee_id)
);

-- Create index for faster queries
CREATE INDEX idx_friendships_requester_id ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee_id ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column
()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW
();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for friendships table
CREATE TRIGGER update_friendships_updated_at 
  BEFORE
UPDATE ON friendships 
  FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();

-- Enable Row Level Security
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for friendships
CREATE POLICY "Users can view their own friendships" ON friendships
  FOR
SELECT USING (
    auth.uid() = requester_id OR
        auth.uid() = addressee_id
  );

CREATE POLICY "Users can create friendship requests" ON friendships
  FOR
INSERT WITH CHECK (
    auth.uid() =
requester_id
);

CREATE POLICY "Users can update their own friendship requests" ON friendships
  FOR
UPDATE USING (
    auth.uid()
= requester_id OR 
    auth.uid
() = addressee_id
  );

CREATE POLICY "Users can delete their own friendships" ON friendships
  FOR
DELETE USING (
    auth.uid
() = requester_id OR 
    auth.uid
() = addressee_id
  );

-- Create function to get friends list
CREATE OR REPLACE FUNCTION get_friends
(user_id UUID)
RETURNS TABLE
(
  friend_id UUID,
  friend_name TEXT,
  status friendship_status,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CASE 
      WHEN f.requester_id = user_id THEN f.addressee_id
      ELSE f.requester_id
    END as friend_id,
        p.name as friend_name,
        f.status,
        f.created_at
    FROM friendships f
        JOIN profiles p ON (
    CASE 
      WHEN f.requester_id = user_id THEN f.addressee_id
      ELSE f.requester_id
    END = p.id
  )
    WHERE (f.requester_id = user_id OR f.addressee_id = user_id)
        AND f.status = 'accepted';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get pending friend requests
CREATE OR REPLACE FUNCTION get_pending_friend_requests
(user_id UUID)
RETURNS TABLE
(
  request_id UUID,
  requester_id UUID,
  requester_name TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        f.id as request_id,
        f.requester_id,
        p.name as requester_name,
        f.created_at
    FROM friendships f
        JOIN profiles p ON f.requester_id = p.id
    WHERE f.addressee_id = user_id
        AND f.status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON friendships TO authenticated;
GRANT EXECUTE ON FUNCTION get_friends
(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_friend_requests
(UUID) TO authenticated;
