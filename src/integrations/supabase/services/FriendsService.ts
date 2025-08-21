import { supabase } from "../client";
import type {
  Friend,
  FriendRequest,
  FriendSuggestion,
  FriendsListResponse,
  SendFriendRequestRequest,
} from "../social-types";

export class FriendsService {
  /**
   * Get all friends for the current user
   */
  static async getFriends(): Promise<Friend[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Query com JOIN para buscar amigos aceitos e nomes dos usuários
      const { data, error } = await supabase
        .from("friendships")
        .select(
          `
            id, 
            requester_id, 
            addressee_id, 
            status, 
            created_at, 
            updated_at,
            requester_profile:profiles!friendships_requester_id_fkey(name),
            addressee_profile:profiles!friendships_addressee_id_fkey(name)
          `
        )
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq("status", "accepted");

      if (error) throw error;

      console.log("🔍 Dados brutos de amigos:", data);

      // Transformar dados para o formato esperado
      const transformed = (data || []).map((friendship) => {
        const isRequester = friendship.requester_id === user.id;
        const friendId = isRequester
          ? friendship.addressee_id
          : friendship.requester_id;
        const friendName = isRequester
          ? friendship.addressee_profile?.name // nome do addressee
          : friendship.requester_profile?.name; // nome do requester

        return {
          id: friendship.id,
          name: friendName || `Usuário ${friendId.slice(0, 8)}`, // Nome real ou fallback
          status: friendship.status,
          created_at: friendship.created_at,
        };
      });

      console.log("🔍 Dados transformados de amigos:", transformed);
      return transformed;
    } catch (error) {
      console.error("Error fetching friends:", error);
      throw error;
    }
  }

  /**
   * Get pending friend requests for the current user
   */
  static async getPendingRequests(): Promise<FriendRequest[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Query com JOIN para buscar solicitações pendentes e nomes dos usuários
      const { data, error } = await supabase
        .from("friendships")
        .select(
          `
            id, 
            requester_id, 
            addressee_id, 
            status, 
            created_at, 
            updated_at,
            requester_profile:profiles!friendships_requester_id_fkey(name)
          `
        )
        .eq("addressee_id", user.id)
        .eq("status", "pending");

      if (error) throw error;

      console.log("🔍 Dados brutos do banco:", data);

      // Transformar dados para o formato esperado
      const transformed = (data || []).map((friendship) => {
        console.log("🔍 Transformando friendship:", friendship);
        return {
          id: friendship.id,
          requester_id: friendship.requester_id,
          addressee_id: friendship.addressee_id,
          requester_name:
            friendship.requester_profile?.name ||
            `Usuário ${friendship.requester_id.slice(0, 8)}`, // Nome real ou fallback
          status: friendship.status,
          created_at: friendship.created_at,
        };
      });

      console.log("🔍 Dados transformados:", transformed);
      return transformed;
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      throw error;
    }
  }

  /**
   * Send a friend request to another user
   */
  static async sendFriendRequest(
    request: SendFriendRequestRequest
  ): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("friendships").insert({
        requester_id: user.id,
        addressee_id: request.user_id,
        status: "pending",
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending friend request:", error);
      throw error;
    }
  }

  /**
   * Accept a friend request
   */
  static async acceptFriendRequest(requestId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("friendships")
        .update({ status: "accepted" })
        .eq("id", requestId)
        .eq("addressee_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error accepting friend request:", error);
      throw error;
    }
  }

  /**
   * Reject a friend request
   */
  static async rejectFriendRequest(requestId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("friendships")
        .update({ status: "rejected" })
        .eq("id", requestId)
        .eq("addressee_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      throw error;
    }
  }

  /**
   * Remove a friend
   */
  static async removeFriend(friendId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("friendships")
        .delete()
        .or(
          `and(requester_id.eq.${user.id},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${user.id})`
        );

      if (error) throw error;
    } catch (error) {
      console.error("Error removing friend:", error);
      throw error;
    }
  }

  /**
   * Block a user
   */
  static async blockUser(userId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First, check if friendship exists
      const { data: existingFriendship } = await supabase
        .from("friendships")
        .select("*")
        .or(
          `and(requester_id.eq.${user.id},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${user.id})`
        )
        .single();

      if (existingFriendship) {
        // Update existing friendship to blocked
        const { error } = await supabase
          .from("friendships")
          .update({ status: "blocked" })
          .eq("id", existingFriendship.id);

        if (error) throw error;
      } else {
        // Create new blocked friendship
        const { error } = await supabase.from("friendships").insert({
          requester_id: user.id,
          addressee_id: userId,
          status: "blocked",
        });

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      throw error;
    }
  }

  /**
   * Unblock a user
   */
  static async unblockUser(userId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("friendships")
        .delete()
        .or(
          `and(requester_id.eq.${user.id},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${user.id})`
        );

      if (error) throw error;
    } catch (error) {
      console.error("Error unblocking user:", error);
      throw error;
    }
  }

  /**
   * Get friend suggestions based on mutual friends and common groups
   */
  static async getFriendSuggestions(): Promise<FriendSuggestion[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // This is a simplified version - in a real app, you'd want more sophisticated logic
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, created_at")
        .neq("id", user.id)
        .limit(10);

      if (error) throw error;

      // Transform to suggestions (simplified)
      return (data || []).map((profile) => ({
        id: profile.id,
        name: profile.name,
        mutual_friends: 0, // Would need complex query to calculate
        common_groups: 0, // Would need complex query to calculate
        last_active: profile.created_at,
      }));
    } catch (error) {
      console.error("Error fetching friend suggestions:", error);
      throw error;
    }
  }

  /**
   * Get complete friends list with pending requests and suggestions
   */
  static async getFriendsList(): Promise<FriendsListResponse> {
    try {
      const [friends, pendingRequests, suggestions] = await Promise.all([
        this.getFriends(),
        this.getPendingRequests(),
        this.getFriendSuggestions(),
      ]);

      return {
        friends,
        pending_requests: pendingRequests,
        suggestions,
      };
    } catch (error) {
      console.error("Error fetching friends list:", error);
      throw error;
    }
  }

  /**
   * Check if current user is friends with another user
   */
  static async areFriends(otherUserId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("friendships")
        .select("status")
        .or(
          `and(requester_id.eq.${user.id},addressee_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},addressee_id.eq.${user.id})`
        )
        .eq("status", "accepted")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking friendship status:", error);
      return false;
    }
  }

  /**
   * Get friendship status between current user and another user
   */
  static async getFriendshipStatus(
    otherUserId: string
  ): Promise<string | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("friendships")
        .select("status")
        .or(
          `and(requester_id.eq.${user.id},addressee_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},addressee_id.eq.${user.id})`
        )
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data?.status || null;
    } catch (error) {
      console.error("Error getting friendship status:", error);
      return null;
    }
  }

  /**
   * Search for users by name (for adding friends)
   */
  static async searchUsers(query: string): Promise<FriendSuggestion[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, created_at")
        .ilike("name", `%${query}%`)
        .neq("id", user.id)
        .limit(10);

      if (error) throw error;

      return (data || []).map((profile) => ({
        id: profile.id,
        name: profile.name,
        mutual_friends: 0,
        common_groups: 0,
        last_active: profile.created_at,
      }));
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  }
}
