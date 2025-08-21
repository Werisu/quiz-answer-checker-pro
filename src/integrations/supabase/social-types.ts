// Types for the Social System (Friends, Study Groups, Chat)

// ===== FRIENDSHIP SYSTEM =====

export type FriendshipStatus = "pending" | "accepted" | "rejected" | "blocked";

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
}

export interface FriendRequest {
  id: string;
  requester_id: string;
  addressee_id: string;
  requester_name: string;
  status: FriendshipStatus;
  created_at: string;
}

export interface Friend {
  id: string;
  name: string;
  status: FriendshipStatus;
  created_at: string;
}

// ===== STUDY GROUPS SYSTEM =====

export type GroupRole = "admin" | "moderator" | "member";
export type InvitationStatus = "pending" | "accepted" | "declined" | "expired";
export type ResourceType = "pdf" | "link" | "note" | "question" | "quiz";
export type ActivityType =
  | "quiz_completed"
  | "goal_achieved"
  | "resource_shared"
  | "study_session"
  | "challenge_created";

export interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  creator_id: string;
  is_public: boolean;
  max_members: number;
  created_at: string;
  updated_at: string;
  // Computed fields
  member_count?: number;
  user_role?: GroupRole;
  joined_at?: string;
  is_member?: boolean;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: GroupRole;
  joined_at: string;
  // Computed fields
  user_name?: string;
  user_avatar?: string;
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  inviter_id: string;
  invitee_id: string;
  status: InvitationStatus;
  message: string | null;
  created_at: string;
  expires_at: string;
  // Computed fields
  group_name?: string;
  inviter_name?: string;
  invitee_name?: string;
}

export interface SharedResource {
  id: string;
  group_id: string;
  user_id: string;
  type: ResourceType;
  title: string;
  description: string | null;
  url: string | null;
  file_path: string | null;
  created_at: string;
  // Computed fields
  user_name?: string;
  file_size?: number;
  download_count?: number;
}

export interface GroupActivity {
  id: string;
  group_id: string;
  user_id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  // Computed fields
  user_name?: string;
  user_avatar?: string;
}

// ===== CHAT SYSTEM =====

export type ChatRoomType = "group" | "private" | "direct";
export type MessageType = "text" | "image" | "file" | "system" | "reaction";

export interface ChatRoom {
  id: string;
  name: string | null;
  type: ChatRoomType;
  group_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
  participants?: ChatParticipant[];
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  message_type: MessageType;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  // Computed fields
  user_name?: string;
  user_avatar?: string;
  is_own_message?: boolean;
  reactions?: MessageReaction[];
}

export interface ChatParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
  // Computed fields
  user_name?: string;
  user_avatar?: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  // Computed fields
  user_name?: string;
}

// ===== SOCIAL DASHBOARD =====

export interface SocialActivity {
  id: string;
  type:
    | "friend_request"
    | "group_invitation"
    | "new_message"
    | "group_activity"
    | "achievement";
  title: string;
  description: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  created_at: string;
  metadata?: Record<string, any>;
  is_read: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked_at: string;
  category: "social" | "study" | "collaboration" | "mastery";
}

export interface SocialStats {
  total_friends: number;
  total_friends: number;
  total_groups: number;
  active_groups: number;
  unread_messages: number;
  pending_requests: number;
  total_points: number;
  level: number;
}

// ===== API RESPONSES =====

export interface FriendsListResponse {
  friends: Friend[];
  pending_requests: FriendRequest[];
  suggestions: FriendSuggestion[];
}

export interface FriendSuggestion {
  id: string;
  name: string;
  mutual_friends: number;
  common_groups: number;
  last_active: string;
}

export interface GroupsListResponse {
  user_groups: StudyGroup[];
  public_groups: StudyGroup[];
  invitations: GroupInvitation[];
}

export interface ChatRoomsResponse {
  rooms: ChatRoom[];
  unread_counts: Record<string, number>;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  has_more: boolean;
  cursor?: string;
}

// ===== REQUEST/INSERT TYPES =====

export interface CreateGroupRequest {
  name: string;
  description?: string;
  is_public: boolean;
  max_members?: number;
}

export interface SendFriendRequestRequest {
  user_id: string;
  message?: string;
}

export interface CreateChatRoomRequest {
  type: ChatRoomType;
  name?: string;
  group_id?: string;
  participant_ids?: string[];
}

export interface SendMessageRequest {
  room_id: string;
  content: string;
  message_type?: MessageType;
  metadata?: Record<string, any>;
}

// ===== REAL-TIME EVENTS =====

export interface SocialRealtimeEvent {
  type:
    | "friend_request"
    | "friend_offline"
    | "group_invitation"
    | "new_message"
    | "group_activity";
  data: any;
  timestamp: string;
}

export interface NewMessageEvent {
  room_id: string;
  message: ChatMessage;
}

export interface GroupActivityEvent {
  group_id: string;
  activity: GroupActivity;
}

// ===== UTILITY TYPES =====

export type SocialTab =
  | "friends"
  | "groups"
  | "chat"
  | "activities"
  | "achievements";

export interface SocialNavigationState {
  active_tab: SocialTab;
  selected_friend?: string;
  selected_group?: string;
  selected_chat_room?: string;
}

export interface SocialFilters {
  friends: {
    status?: FriendshipStatus;

    search?: string;
  };
  groups: {
    type?: "all" | "public" | "private" | "member";
    search?: string;
    sort_by?: "name" | "member_count" | "created_at" | "activity";
  };
  activities: {
    type?: ActivityType[];
    user_id?: string;
    group_id?: string;
    date_range?: {
      start: string;
      end: string;
    };
  };
}

// ===== USER SEARCH TYPES =====

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
  study_stats?: {
    quizzes_completed: number;
    goals_achieved: number;
    total_study_time: number;
  };
}
