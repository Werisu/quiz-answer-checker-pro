import { supabase } from "../client";
import type {
  CreateGroupRequest,
  GroupInvitation,
  GroupMember,
  GroupsListResponse,
  StudyGroup,
} from "../social-types";

export class StudyGroupsService {
  /**
   * Get all groups the current user is a member of
   */
  static async getUserGroups(): Promise<StudyGroup[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("get_user_groups", {
        user_id: user.id,
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user groups:", error);
      throw error;
    }
  }

  /**
   * Get all public groups available to join
   */
  static async getPublicGroups(): Promise<StudyGroup[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("get_public_groups", {
        user_id: user.id,
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching public groups:", error);
      throw error;
    }
  }

  /**
   * Create a new study group
   */
  static async createGroup(groupData: CreateGroupRequest): Promise<StudyGroup> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create the group
      const { data: group, error: groupError } = await supabase
        .from("study_groups")
        .insert({
          name: groupData.name,
          description: groupData.description,
          creator_id: user.id,
          is_public: groupData.is_public,
          max_members: groupData.max_members || 50,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: "admin",
        });

      if (memberError) throw memberError;

      // Create default chat room for the group
      const { error: chatError } = await supabase.from("chat_rooms").insert({
        name: `Chat - ${group.name}`,
        type: "group",
        group_id: group.id,
        created_by: user.id,
      });

      if (chatError) throw chatError;

      return group;
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  }

  /**
   * Join a public group
   */
  static async joinGroup(groupId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if group is public
      const { data: group, error: groupError } = await supabase
        .from("study_groups")
        .select("is_public, max_members")
        .eq("id", groupId)
        .single();

      if (groupError) throw groupError;
      if (!group.is_public) throw new Error("Group is not public");

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single();

      if (existingMember) throw new Error("Already a member of this group");

      // Check if group is full
      const { count: memberCount } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", groupId);

      if (memberCount && memberCount >= group.max_members) {
        throw new Error("Group is full");
      }

      // Add user as member
      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: user.id,
        role: "member",
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error joining group:", error);
      throw error;
    }
  }

  /**
   * Leave a group
   */
  static async leaveGroup(groupId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if user is the creator
      const { data: group } = await supabase
        .from("study_groups")
        .select("creator_id")
        .eq("id", groupId)
        .single();

      if (group?.creator_id === user.id) {
        throw new Error(
          "Group creator cannot leave. Transfer ownership or delete the group."
        );
      }

      // Remove user from group
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error leaving group:", error);
      throw error;
    }
  }

  /**
   * Invite a user to a group
   */
  static async inviteUser(
    groupId: string,
    userId: string,
    message?: string
  ): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if user has permission to invite (admin or moderator)
      const { data: member } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single();

      if (!member || !["admin", "moderator"].includes(member.role)) {
        throw new Error("Insufficient permissions to invite users");
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", groupId)
        .eq("user_id", userId)
        .single();

      if (existingMember) throw new Error("User is already a member");

      // Check if invitation already exists
      const { data: existingInvitation } = await supabase
        .from("group_invitations")
        .select("id")
        .eq("group_id", groupId)
        .eq("invitee_id", userId)
        .eq("status", "pending")
        .single();

      if (existingInvitation) throw new Error("Invitation already sent");

      // Send invitation
      const { error } = await supabase.from("group_invitations").insert({
        group_id: groupId,
        inviter_id: user.id,
        invitee_id: userId,
        message: message || null,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error inviting user:", error);
      throw error;
    }
  }

  /**
   * Accept a group invitation
   */
  static async acceptInvitation(invitationId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get invitation details
      const { data: invitation, error: invitationError } = await supabase
        .from("group_invitations")
        .select("*")
        .eq("id", invitationId)
        .eq("invitee_id", user.id)
        .eq("status", "pending")
        .single();

      if (invitationError) throw invitationError;

      // Check if group is full
      const { count: memberCount } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", invitation.group_id);

      const { data: group } = await supabase
        .from("study_groups")
        .select("max_members")
        .eq("id", invitation.group_id)
        .single();

      if (memberCount && group && memberCount >= group.max_members) {
        throw new Error("Group is full");
      }

      // Add user to group
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: invitation.group_id,
          user_id: user.id,
          role: "member",
        });

      if (memberError) throw memberError;

      // Update invitation status
      const { error: updateError } = await supabase
        .from("group_invitations")
        .update({ status: "accepted" })
        .eq("id", invitationId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error accepting invitation:", error);
      throw error;
    }
  }

  /**
   * Decline a group invitation
   */
  static async declineInvitation(invitationId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("group_invitations")
        .update({ status: "declined" })
        .eq("id", invitationId)
        .eq("invitee_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error declining invitation:", error);
      throw error;
    }
  }

  /**
   * Get group members
   */
  static async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const { data, error } = await supabase
        .from("group_members")
        .select(
          `
          *,
          profiles:user_id (
            name
          )
        `
        )
        .eq("group_id", groupId)
        .order("joined_at", { ascending: true });

      if (error) throw error;

      return (data || []).map((member) => ({
        ...member,
        user_name: member.profiles?.name,
      }));
    } catch (error) {
      console.error("Error fetching group members:", error);
      throw error;
    }
  }

  /**
   * Update member role (admin only)
   */
  static async updateMemberRole(
    groupId: string,
    userId: string,
    newRole: string
  ): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if user is admin
      const { data: member } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single();

      if (!member || member.role !== "admin") {
        throw new Error("Only admins can update member roles");
      }

      // Prevent admin from changing their own role
      if (userId === user.id) {
        throw new Error("Cannot change your own role");
      }

      const { error } = await supabase
        .from("group_members")
        .update({ role: newRole })
        .eq("group_id", groupId)
        .eq("user_id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating member role:", error);
      throw error;
    }
  }

  /**
   * Remove member from group (admin/moderator only)
   */
  static async removeMember(groupId: string, userId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if user has permission
      const { data: member } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single();

      if (!member || !["admin", "moderator"].includes(member.role)) {
        throw new Error("Insufficient permissions to remove members");
      }

      // Prevent removing admins (unless you're also admin)
      const { data: targetMember } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", userId)
        .single();

      if (targetMember?.role === "admin" && member.role !== "admin") {
        throw new Error("Only admins can remove other admins");
      }

      // Prevent removing yourself
      if (userId === user.id) {
        throw new Error("Cannot remove yourself from the group");
      }

      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error removing member:", error);
      throw error;
    }
  }

  /**
   * Get group invitations for current user
   */
  static async getGroupInvitations(): Promise<GroupInvitation[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("group_invitations")
        .select(
          `
          *,
          study_groups:group_id (
            name
          ),
          profiles:inviter_id (
            name
          )
        `
        )
        .eq("invitee_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((invitation) => ({
        ...invitation,
        group_name: invitation.study_groups?.name,
        inviter_name: invitation.profiles?.name,
      }));
    } catch (error) {
      console.error("Error fetching group invitations:", error);
      throw error;
    }
  }

  /**
   * Get complete groups list with invitations
   */
  static async getGroupsList(): Promise<GroupsListResponse> {
    try {
      const [userGroups, publicGroups, invitations] = await Promise.all([
        this.getUserGroups(),
        this.getPublicGroups(),
        this.getGroupInvitations(),
      ]);

      return {
        user_groups: userGroups,
        public_groups: publicGroups,
        invitations,
      };
    } catch (error) {
      console.error("Error fetching groups list:", error);
      throw error;
    }
  }

  /**
   * Update group information (creator only)
   */
  static async updateGroup(
    groupId: string,
    updates: Partial<CreateGroupRequest>
  ): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if user is the creator
      const { data: group } = await supabase
        .from("study_groups")
        .select("creator_id")
        .eq("id", groupId)
        .single();

      if (!group || group.creator_id !== user.id) {
        throw new Error("Only group creator can update group information");
      }

      const { error } = await supabase
        .from("study_groups")
        .update(updates)
        .eq("id", groupId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating group:", error);
      throw error;
    }
  }

  /**
   * Delete group (creator only)
   */
  static async deleteGroup(groupId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if user is the creator
      const { data: group } = await supabase
        .from("study_groups")
        .select("creator_id")
        .eq("id", groupId)
        .single();

      if (!group || group.creator_id !== user.id) {
        throw new Error("Only group creator can delete the group");
      }

      // Delete the group (cascade will handle related records)
      const { error } = await supabase
        .from("study_groups")
        .delete()
        .eq("id", groupId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting group:", error);
      throw error;
    }
  }
}
