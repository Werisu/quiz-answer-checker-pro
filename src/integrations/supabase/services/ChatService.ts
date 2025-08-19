import { supabase } from "../client";
import type {
  ChatMessage,
  ChatParticipant,
  ChatRoom,
  ChatRoomsResponse,
  CreateChatRoomRequest,
  MessageReaction,
  MessagesResponse,
  SendMessageRequest,
} from "../social-types";

export class ChatService {
  /**
   * Get all chat rooms for the current user
   */
  static async getUserChatRooms(): Promise<ChatRoom[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("get_user_chat_rooms", {
        user_id: user.id,
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw error;
    }
  }

  /**
   * Get messages for a specific chat room
   */
  static async getRoomMessages(
    roomId: string,
    limit = 50,
    cursor?: string
  ): Promise<MessagesResponse> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let query = supabase
        .from("chat_messages")
        .select(
          `
          *,
          profiles:user_id (
            name
          )
        `
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (cursor) {
        query = query.lt("created_at", cursor);
      }

      const { data, error } = await query;

      if (error) throw error;

      const messages = (data || []).map((message) => ({
        ...message,
        user_name: message.profiles?.name,
        is_own_message: message.user_id === user.id,
      }));

      return {
        messages: messages.reverse(), // Show oldest first
        has_more: messages.length === limit,
        cursor:
          messages.length > 0
            ? messages[messages.length - 1].created_at
            : undefined,
      };
    } catch (error) {
      console.error("Error fetching room messages:", error);
      throw error;
    }
  }

  /**
   * Send a message to a chat room
   */
  static async sendMessage(request: SendMessageRequest): Promise<ChatMessage> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          room_id: request.room_id,
          user_id: user.id,
          content: request.content,
          message_type: request.message_type || "text",
          metadata: request.metadata || null,
        })
        .select(
          `
          *,
          profiles:user_id (
            name
          )
        `
        )
        .single();

      if (error) throw error;

      return {
        ...data,
        user_name: data.profiles?.name,
        is_own_message: true,
      };
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Create a private chat room between two users
   */
  static async createPrivateChat(otherUserId: string): Promise<ChatRoom> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (user.id === otherUserId) {
        throw new Error("Cannot create chat room with yourself");
      }

      const { data, error } = await supabase.rpc("create_private_chat", {
        user1_id: user.id,
        user2_id: otherUserId,
      });

      if (error) throw error;

      // Get the created room
      const { data: room, error: roomError } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("id", data)
        .single();

      if (roomError) throw roomError;

      return room;
    } catch (error) {
      console.error("Error creating private chat:", error);
      throw error;
    }
  }

  /**
   * Create a group chat room
   */
  static async createGroupChat(
    request: CreateChatRoomRequest
  ): Promise<ChatRoom> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (request.type !== "group") {
        throw new Error("This method is only for group chat rooms");
      }

      if (!request.group_id) {
        throw new Error("Group ID is required for group chat rooms");
      }

      // Check if user is member of the group
      const { data: member } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", request.group_id)
        .eq("user_id", user.id)
        .single();

      if (!member) {
        throw new Error(
          "You must be a member of the group to create a chat room"
        );
      }

      // Check if chat room already exists for this group
      const { data: existingRoom } = await supabase
        .from("chat_rooms")
        .select("id")
        .eq("group_id", request.group_id)
        .eq("type", "group")
        .single();

      if (existingRoom) {
        throw new Error("Chat room already exists for this group");
      }

      // Create the chat room
      const { data, error } = await supabase
        .from("chat_rooms")
        .insert({
          name: request.name || "Group Chat",
          type: "group",
          group_id: request.group_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error creating group chat:", error);
      throw error;
    }
  }

  /**
   * Mark messages as read in a room
   */
  static async markMessagesAsRead(roomId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.rpc("mark_messages_as_read", {
        room_id: roomId,
        user_id: user.id,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  }

  /**
   * Get chat room participants
   */
  static async getRoomParticipants(roomId: string): Promise<ChatParticipant[]> {
    try {
      const { data, error } = await supabase
        .from("chat_participants")
        .select(
          `
          *,
          profiles:user_id (
            name
          )
        `
        )
        .eq("room_id", roomId)
        .order("joined_at", { ascending: true });

      if (error) throw error;

      return (data || []).map((participant) => ({
        ...participant,
        user_name: participant.profiles?.name,
      }));
    } catch (error) {
      console.error("Error fetching room participants:", error);
      throw error;
    }
  }

  /**
   * Add reaction to a message
   */
  static async addReaction(
    messageId: string,
    emoji: string
  ): Promise<MessageReaction> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if reaction already exists
      const { data: existingReaction } = await supabase
        .from("message_reactions")
        .select("id")
        .eq("message_id", messageId)
        .eq("user_id", user.id)
        .eq("emoji", emoji)
        .single();

      if (existingReaction) {
        throw new Error("Reaction already exists");
      }

      const { data, error } = await supabase
        .from("message_reactions")
        .insert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        })
        .select(
          `
          *,
          profiles:user_id (
            name
          )
        `
        )
        .single();

      if (error) throw error;

      return {
        ...data,
        user_name: data.profiles?.name,
      };
    } catch (error) {
      console.error("Error adding reaction:", error);
      throw error;
    }
  }

  /**
   * Remove reaction from a message
   */
  static async removeReaction(messageId: string, emoji: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", user.id)
        .eq("emoji", emoji);

      if (error) throw error;
    } catch (error) {
      console.error("Error removing reaction:", error);
      throw error;
    }
  }

  /**
   * Get message reactions
   */
  static async getMessageReactions(
    messageId: string
  ): Promise<MessageReaction[]> {
    try {
      const { data, error } = await supabase
        .from("message_reactions")
        .select(
          `
          *,
          profiles:user_id (
            name
          )
        `
        )
        .eq("message_id", messageId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return (data || []).map((reaction) => ({
        ...reaction,
        user_name: reaction.profiles?.name,
      }));
    } catch (error) {
      console.error("Error fetching message reactions:", error);
      throw error;
    }
  }

  /**
   * Delete a message (only own messages)
   */
  static async deleteMessage(messageId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("id", messageId)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  }

  /**
   * Edit a message (only own messages)
   */
  static async editMessage(
    messageId: string,
    newContent: string
  ): Promise<ChatMessage> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("chat_messages")
        .update({
          content: newContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", messageId)
        .eq("user_id", user.id)
        .select(
          `
          *,
          profiles:user_id (
            name
          )
        `
        )
        .single();

      if (error) throw error;

      return {
        ...data,
        user_name: data.profiles?.name,
        is_own_message: true,
      };
    } catch (error) {
      console.error("Error editing message:", error);
      throw error;
    }
  }

  /**
   * Get unread message count for all rooms
   */
  static async getUnreadCounts(): Promise<Record<string, number>> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("get_user_chat_rooms", {
        user_id: user.id,
      });

      if (error) throw error;

      const unreadCounts: Record<string, number> = {};
      (data || []).forEach((room) => {
        unreadCounts[room.room_id] = room.unread_count || 0;
      });

      return unreadCounts;
    } catch (error) {
      console.error("Error fetching unread counts:", error);
      throw error;
    }
  }

  /**
   * Get complete chat rooms response with unread counts
   */
  static async getChatRoomsResponse(): Promise<ChatRoomsResponse> {
    try {
      const [rooms, unreadCounts] = await Promise.all([
        this.getUserChatRooms(),
        this.getUnreadCounts(),
      ]);

      return {
        rooms,
        unread_counts: unreadCounts,
      };
    } catch (error) {
      console.error("Error fetching chat rooms response:", error);
      throw error;
    }
  }

  /**
   * Search messages in a room
   */
  static async searchMessages(
    roomId: string,
    query: string
  ): Promise<ChatMessage[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("chat_messages")
        .select(
          `
          *,
          profiles:user_id (
            name
          )
        `
        )
        .eq("room_id", roomId)
        .ilike("content", `%${query}%`)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return (data || []).map((message) => ({
        ...message,
        user_name: message.profiles?.name,
        is_own_message: message.user_id === user.id,
      }));
    } catch (error) {
      console.error("Error searching messages:", error);
      throw error;
    }
  }
}
