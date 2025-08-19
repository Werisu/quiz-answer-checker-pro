-- Migration: Add Chat System
-- Date: 2024-03-23
-- Description: Implements the chat system for groups and private conversations


-- Create chat_room_type enum
CREATE TYPE chat_room_type AS ENUM ('group', 'private', 'direct');

-- Create message_type enum
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system', 'reaction');

-- Create chat_rooms table for organizing conversations
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  type chat_room_type NOT NULL,
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type message_type NOT NULL DEFAULT 'text',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_participants table for private/direct chats
CREATE TABLE chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_chat_rooms_type ON chat_rooms(type);
CREATE INDEX idx_chat_rooms_group_id ON chat_rooms(group_id);
CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_participants_room_id ON chat_participants(room_id);
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_chat_rooms_updated_at 
  BEFORE UPDATE ON chat_rooms 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at 
  BEFORE UPDATE ON chat_messages 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_rooms
CREATE POLICY "Users can view group chat rooms they are members of" ON chat_rooms
  FOR SELECT USING (
    type = 'group' AND
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = chat_rooms.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view private chat rooms they participate in" ON chat_rooms
  FOR SELECT USING (
    type = 'private' AND
    EXISTS (
      SELECT 1 FROM chat_participants cp
      WHERE cp.room_id = chat_rooms.id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can create group chat rooms" ON chat_rooms
  FOR INSERT WITH CHECK (
    type = 'group' AND
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = chat_rooms.group_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create private chat rooms" ON chat_rooms
  FOR INSERT WITH CHECK (
    type = 'private' AND auth.uid() = created_by
  );

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in rooms they have access to" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_rooms cr
      LEFT JOIN chat_participants cp ON cr.id = cp.room_id
      LEFT JOIN group_members gm ON cr.group_id = gm.group_id
      WHERE cr.id = chat_messages.room_id
        AND (
          (cr.type = 'group' AND gm.user_id = auth.uid()) OR
          (cr.type = 'private' AND cp.user_id = auth.uid())
        )
    )
  );

CREATE POLICY "Users can send messages in rooms they have access to" ON chat_messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chat_rooms cr
      LEFT JOIN chat_participants cp ON cr.id = cp.room_id
      LEFT JOIN group_members gm ON cr.group_id = gm.group_id
      WHERE cr.id = chat_messages.room_id
        AND (
          (cr.type = 'group' AND gm.user_id = auth.uid()) OR
          (cr.type = 'private' AND cp.user_id = auth.uid())
        )
    )
  );

CREATE POLICY "Users can update their own messages" ON chat_messages
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own messages" ON chat_messages
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for chat_participants
CREATE POLICY "Users can view participants in rooms they have access to" ON chat_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_rooms cr
      LEFT JOIN group_members gm ON cr.group_id = gm.group_id
      WHERE cr.id = chat_participants.room_id
        AND (
          (cr.type = 'group' AND gm.user_id = auth.uid()) OR
          (cr.type = 'private' AND chat_participants.user_id = auth.uid())
        )
    )
  );

CREATE POLICY "Users can add themselves to private chat rooms" ON chat_participants
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chat_rooms cr
      WHERE cr.id = chat_participants.room_id
        AND cr.type = 'private'
        AND cr.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update their own participation" ON chat_participants
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can remove themselves from private chat rooms" ON chat_participants
  FOR DELETE USING (user_id = auth.uid());

-- Create functions for common chat operations
CREATE OR REPLACE FUNCTION create_private_chat(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
  room_id UUID;
BEGIN
  -- Check if private chat already exists
  SELECT cr.id INTO room_id
  FROM chat_rooms cr
  JOIN chat_participants cp1 ON cr.id = cp1.room_id
  JOIN chat_participants cp2 ON cr.id = cp2.room_id
  WHERE cr.type = 'private'
    AND cp1.user_id = user1_id
    AND cp2.user_id = user2_id;
  
  -- If room exists, return it
  IF room_id IS NOT NULL THEN
    RETURN room_id;
  END IF;
  
  -- Create new private chat room
  INSERT INTO chat_rooms (name, type, created_by)
  VALUES (NULL, 'private', user1_id)
  RETURNING id INTO room_id;
  
  -- Add both users as participants
  INSERT INTO chat_participants (room_id, user_id) VALUES (room_id, user1_id);
  INSERT INTO chat_participants (room_id, user_id) VALUES (room_id, user2_id);
  
  RETURN room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_chat_rooms(user_id UUID)
RETURNS TABLE (
  room_id UUID,
  room_name VARCHAR(100),
  room_type chat_room_type,
  group_id UUID,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cr.id as room_id,
    cr.name as room_name,
    cr.type as room_type,
    cr.group_id,
    cm.content as last_message,
    cm.created_at as last_message_at,
    COUNT(CASE WHEN cm.created_at > cp.last_read_at THEN 1 END) as unread_count
  FROM chat_rooms cr
  LEFT JOIN chat_participants cp ON cr.id = cp.room_id
  LEFT JOIN group_members gm ON cr.group_id = gm.group_id
  LEFT JOIN LATERAL (
    SELECT content, created_at
    FROM chat_messages
    WHERE room_id = cr.id
    ORDER BY created_at DESC
    LIMIT 1
  ) cm ON true
  WHERE (cr.type = 'private' AND cp.user_id = user_id)
     OR (cr.type = 'group' AND gm.user_id = user_id)
  GROUP BY cr.id, cr.name, cr.type, cr.group_id, cm.content, cm.created_at
  ORDER BY cm.created_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION mark_messages_as_read(room_id UUID, user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE chat_participants
  SET last_read_at = NOW()
  WHERE room_id = mark_messages_as_read.room_id
    AND user_id = mark_messages_as_read.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON chat_rooms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON chat_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON chat_participants TO authenticated;

GRANT EXECUTE ON FUNCTION create_private_chat(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_chat_rooms(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_messages_as_read(UUID, UUID) TO authenticated;
