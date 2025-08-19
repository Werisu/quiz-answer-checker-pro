-- Migration: Add Study Groups System
-- Date: 2024-03-23
-- Description: Implements the study groups system with members, invitations and resources

-- Create group role enum
CREATE TYPE group_role AS ENUM
('admin', 'moderator', 'member');

-- Create invitation status enum
CREATE TYPE invitation_status AS ENUM
('pending', 'accepted', 'declined', 'expired');

-- Create resource type enum
CREATE TYPE resource_type AS ENUM
('pdf', 'link', 'note', 'question', 'quiz');

-- Create activity type enum
CREATE TYPE activity_type AS ENUM
('quiz_completed', 'goal_achieved', 'resource_shared', 'study_session', 'challenge_created');

-- Create study_groups table
CREATE TABLE study_groups
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    max_members INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create group_members table
CREATE TABLE group_members
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role group_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Create group_invitations table
CREATE TABLE group_invitations
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    invitee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status invitation_status NOT NULL DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL
    '7 days')
);

    -- Create shared_resources table
    CREATE TABLE shared_resources
    (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        type resource_type NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        url TEXT,
        file_path TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create group_activities table
    CREATE TABLE group_activities
    (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        type activity_type NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create indexes for better performance
    CREATE INDEX idx_study_groups_creator_id ON study_groups(creator_id);
    CREATE INDEX idx_study_groups_is_public ON study_groups(is_public);
    CREATE INDEX idx_group_members_group_id ON group_members(group_id);
    CREATE INDEX idx_group_members_user_id ON group_members(user_id);
    CREATE INDEX idx_group_invitations_group_id ON group_invitations(group_id);
    CREATE INDEX idx_group_invitations_invitee_id ON group_invitations(invitee_id);
    CREATE INDEX idx_group_invitations_status ON group_invitations(status);
    CREATE INDEX idx_shared_resources_group_id ON shared_resources(group_id);
    CREATE INDEX idx_group_activities_group_id ON group_activities(group_id);

    -- Create triggers for updated_at columns
    CREATE TRIGGER update_study_groups_updated_at 
    BEFORE
    UPDATE ON study_groups 
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column
    ();

    -- Enable Row Level Security on all tables
    ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
    ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
    ALTER TABLE group_invitations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE shared_resources ENABLE ROW LEVEL SECURITY;
    ALTER TABLE group_activities ENABLE ROW LEVEL SECURITY;

    -- RLS Policies for study_groups
    CREATE POLICY "Users can view public groups" ON study_groups
    FOR
    SELECT USING (is_public = true);

    CREATE POLICY "Group members can view private groups" ON study_groups
    FOR
    SELECT USING (
        EXISTS (
            SELECT 1
        FROM group_members gm
        WHERE gm.group_id = study_groups.id AND gm.user_id = auth.uid()
        )
    );

    CREATE POLICY "Users can create groups" ON study_groups
    FOR
    INSERT WITH CHECK (auth.uid() =
    creator_id);

    CREATE POLICY "Group creators can update their groups" ON study_groups
    FOR
    UPDATE USING (auth.uid()
    = creator_id);

    CREATE POLICY "Group creators can delete their groups" ON study_groups
    FOR
    DELETE USING (auth.uid
    () = creator_id);

    -- RLS Policies for group_members
    CREATE POLICY "Group members can view other members" ON group_members
    FOR
    SELECT USING (
        EXISTS (
            SELECT 1
        FROM group_members gm
        WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()
        )
    );

    CREATE POLICY "Group creators can add members" ON group_members
    FOR
    INSERT WITH CHECK
        (
        EXISTS (
        SELECT 1 FRO
     study_groups sg
        WHERE sg.id = group_members.group_id AND sg.creator_id = auth.uid()
        )
    );

    CREATE POLICY "Group members can remove themselves" ON group_members
    FOR
    DELETE USING (auth.uid
    () = user_id);

    CREATE POLICY "Group creators can remove any member" ON group_members
    FOR
    DELETE USING (
        EXISTS
    (
            SELECT 1
    FROM study_groups sg
    WHERE sg.id = group_members.group_id AND sg.creator_id = auth.uid()
        )
    );

    -- RLS Policies for group_invitations
    CREATE POLICY "Group members can view group invitations" ON group_invitations
    FOR
    SELECT USING (
        EXISTS (
            SELECT 1
        FROM group_members gm
        WHERE gm.group_id = group_invitations.group_id AND gm.user_id = auth.uid()
        )
    );

    CREATE POLICY "Group members can send invitations" ON group_invitations
    FOR
    INSERT WITH CHECK
        (
        EXISTS (

        SELE
    T 1 FROM group_member
    WHERE gm.group_id = group_invitations.group_id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('admin', 'moderator')
        )
    );

    CREATE POLICY "Invitees can update their invitations" ON group_invitations
    FOR
    UPDATE USING (auth.uid()
    = invitee_id);

    -- RLS Policies for shared_resources
    CREATE POLICY "Group members can view shared resources" ON shared_resources
    FOR
    SELECT USING (
        EXISTS (
            SELECT 1
        FROM group_members gm
        WHERE gm.group_id = shared_resources.group_id AND gm.user_id = auth.uid()
        )
    );

    CREATE POLICY "Group members can share resources" ON shared_resources
    FOR
    INSERT WITH CHECK
        (
        EXISTS (
        SELECT 1 FRO
     group_members gm
        WHERE gm.group_id = shared_resources.group_id AND gm.user_id = auth.uid()
        )
    );

    CREATE POLICY "Resource owners can update their resources" ON shared_resources
    FOR
    UPDATE USING (auth.uid()
    = user_id);

    CREATE POLICY "Resource owners can delete their resources" ON shared_resources
    FOR
    DELETE USING (auth.uid
    () = user_id);

    -- RLS Policies for group_activities
    CREATE POLICY "Group members can view group activities" ON group_activities
    FOR
    SELECT USING (
        EXISTS (
            SELECT 1
        FROM group_members gm
        WHERE gm.group_id = group_activities.group_id AND gm.user_id = auth.uid()
        )
    );

    CREATE POLICY "Group members can create activities" ON group_activities
    FOR
    INSERT WITH CHECK
        (
        EXISTS (
        SELECT 1 FRO
     group_members gm
        WHERE gm.group_id = group_activities.group_id AND gm.user_id = auth.uid()
        )
    );

    -- Create functions for common operations
    CREATE OR REPLACE FUNCTION get_user_groups
    (user_id UUID)
RETURNS TABLE
    (
    group_id UUID,
    group_name VARCHAR
    (100),
    description TEXT,
    is_public BOOLEAN,
    member_count BIGINT,
    user_role group_role,
    joined_at TIMESTAMPTZ
) AS $$
    BEGIN
        RETURN QUERY
        SELECT
            sg.id as group_id,
            sg.name as group_name,
            sg.description,
            sg.is_public,
            COUNT(gm2.user_id) as member_count,
            gm.role as user_role,
            gm.joined_at
        FROM group_members gm
            JOIN study_groups sg ON gm.group_id = sg.id
            LEFT JOIN group_members gm2 ON sg.id = gm2.group_id
        WHERE gm.user_id = user_id
        GROUP BY sg.id, sg.name, sg.description, sg.is_public, gm.role, gm.joined_at;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    CREATE OR REPLACE FUNCTION get_public_groups
    (user_id UUID)
RETURNS TABLE
    (
    group_id UUID,
    group_name VARCHAR
    (100),
    description TEXT,
    member_count BIGINT,
    is_member BOOLEAN
) AS $$
    BEGIN
        RETURN QUERY
        SELECT
            sg.id as group_id,
            sg.name as group_name,
            sg.description,
            COUNT(gm.user_id) as member_count,
            EXISTS
        (
            SELECT 1
        FROM group_members gm2
        WHERE gm2.group_id = sg.id AND gm2.user_id = user_id
        )
        as is_member
    FROM study_groups sg
    LEFT JOIN group_members gm ON sg.id = gm.group_id
    WHERE sg.is_public = true
    GROUP BY sg.id, sg.name, sg.description;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Grant permissions to authenticated users
    GRANT SELECT, INSERT, UPDATE, DELETE ON study_groups TO authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON group_members TO authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON group_invitations TO authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON shared_resources TO authenticated;
    GRANT SELECT, INSERT ON group_activities TO authenticated;

    GRANT EXECUTE ON FUNCTION get_user_groups
    (UUID) TO authenticated;
    GRANT EXECUTE ON FUNCTION get_public_groups
    (UUID) TO authenticated;
