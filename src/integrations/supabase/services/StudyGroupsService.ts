import { CreateGroupData } from "@/hooks/useStudyGroups";
import { supabase } from "../client";

export class StudyGroupsService {
  // Buscar grupos do usuário (incluindo grupos que ele participa)
  static async getUserGroups() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar grupos onde o usuário é membro
      const { data: userGroups, error } = await supabase
        .from("study_groups")
        .select(
          `
          *,
          group_members!inner(
            user_id,
            role
          ),
          owner_profile:profiles!study_groups_owner_id_fkey(name)
        `
        )
        .eq("group_members.user_id", user.id);

      if (error) {
        throw error;
      }

      // Transformar dados para incluir informações do usuário
      const transformedGroups =
        userGroups?.map((group) => ({
          ...group,
          owner_name: group.owner_profile?.name || "Usuário",
          user_role: group.group_members?.[0]?.role || "member",
          is_owner: group.owner_id === user.id,
          member_count: group.group_members?.length || 0,
        })) || [];

      return { data: transformedGroups, error: null };
    } catch (error) {
      console.error("Erro ao buscar grupos do usuário:", error);
      return { data: [], error: error as Error };
    }
  }

  // Buscar convites pendentes do usuário
  static async getUserInvitations() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { data: invitations, error } = await supabase
        .from("group_invitations")
        .select(
          `
          *,
          group:study_groups(name),
          inviter_profile:profiles!group_invitations_inviter_id_fkey(name)
        `
        )
        .eq("invitee_id", user.id)
        .eq("status", "pending");

      if (error) {
        throw error;
      }

      const transformedInvitations =
        invitations?.map((invitation) => ({
          ...invitation,
          group_name: invitation.group?.name || "Grupo",
          inviter_name: invitation.inviter_profile?.name || "Usuário",
        })) || [];

      return { data: transformedInvitations, error: null };
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
      return { data: [], error: error as Error };
    }
  }

  // Criar novo grupo
  static async createGroup(groupData: CreateGroupData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Criar o grupo
      const { data: newGroup, error: createError } = await supabase
        .from("study_groups")
        .insert({
          name: groupData.name,
          description: groupData.description,
          visibility: groupData.visibility,
          max_members: groupData.max_members,
          tags: groupData.tags,
          owner_id: user.id,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Adicionar o criador como admin do grupo
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: newGroup.id,
          user_id: user.id,
          role: "admin",
        });

      if (memberError) {
        // Se falhar ao adicionar membro, deletar o grupo criado
        await supabase.from("study_groups").delete().eq("id", newGroup.id);
        throw memberError;
      }

      return { data: newGroup, error: null };
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      return { data: null, error: error as Error };
    }
  }

  // Entrar em um grupo (para grupos públicos)
  static async joinGroup(groupId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Verificar se o grupo é público
      const { data: group, error: groupError } = await supabase
        .from("study_groups")
        .select("visibility, max_members")
        .eq("id", groupId)
        .single();

      if (groupError) {
        throw groupError;
      }

      if (group.visibility !== "public") {
        throw new Error("Grupo não é público");
      }

      // Verificar se já é membro
      const { data: existingMember } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single();

      if (existingMember) {
        throw new Error("Usuário já é membro deste grupo");
      }

      // Verificar limite de membros
      const { count: memberCount } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", groupId);

      if (memberCount && memberCount >= group.max_members) {
        throw new Error("Grupo está cheio");
      }

      // Adicionar usuário como membro
      const { error: joinError } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: user.id,
        role: "member",
      });

      if (joinError) {
        throw joinError;
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("Erro ao entrar no grupo:", error);
      return { data: null, error: error as Error };
    }
  }

  // Sair de um grupo
  static async leaveGroup(groupId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Verificar se é o dono do grupo
      const { data: group } = await supabase
        .from("study_groups")
        .select("owner_id")
        .eq("id", groupId)
        .single();

      if (group?.owner_id === user.id) {
        throw new Error(
          "Dono do grupo não pode sair. Transfira a propriedade primeiro."
        );
      }

      // Remover usuário do grupo
      const { error: leaveError } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);

      if (leaveError) {
        throw leaveError;
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("Erro ao sair do grupo:", error);
      return { data: null, error: error as Error };
    }
  }

  // Aceitar convite para grupo
  static async acceptInvitation(invitationId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar o convite
      const { data: invitation, error: invitationError } = await supabase
        .from("group_invitations")
        .select("*")
        .eq("id", invitationId)
        .eq("invitee_id", user.id)
        .eq("status", "pending")
        .single();

      if (invitationError) {
        throw invitationError;
      }

      // Verificar se já é membro
      const { data: existingMember } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", invitation.group_id)
        .eq("user_id", user.id)
        .single();

      if (existingMember) {
        throw new Error("Usuário já é membro deste grupo");
      }

      // Adicionar usuário ao grupo
      const { error: joinError } = await supabase.from("group_members").insert({
        group_id: invitation.group_id,
        user_id: user.id,
        role: "member",
      });

      if (joinError) {
        throw joinError;
      }

      // Atualizar status do convite
      const { error: updateError } = await supabase
        .from("group_invitations")
        .update({ status: "accepted" })
        .eq("id", invitationId);

      if (updateError) {
        throw updateError;
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
      return { data: null, error: error as Error };
    }
  }

  // Rejeitar convite para grupo
  static async rejectInvitation(invitationId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Atualizar status do convite para rejeitado
      const { error: updateError } = await supabase
        .from("group_invitations")
        .update({ status: "rejected" })
        .eq("id", invitationId)
        .eq("invitee_id", user.id);

      if (updateError) {
        throw updateError;
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("Erro ao rejeitar convite:", error);
      return { data: null, error: error as Error };
    }
  }

  // Convidar usuário para grupo
  static async inviteUser(groupId: string, userId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Verificar se o usuário tem permissão para convidar
      const { data: member } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single();

      if (!member || (member.role !== "admin" && member.role !== "moderator")) {
        throw new Error("Sem permissão para convidar usuários");
      }

      // Verificar se o usuário já é membro
      const { data: existingMember } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", groupId)
        .eq("user_id", userId)
        .single();

      if (existingMember) {
        throw new Error("Usuário já é membro deste grupo");
      }

      // Verificar se já existe um convite pendente
      const { data: existingInvitation } = await supabase
        .from("group_invitations")
        .select("id")
        .eq("group_id", groupId)
        .eq("invitee_id", userId)
        .eq("status", "pending")
        .single();

      if (existingInvitation) {
        throw new Error("Convite já enviado para este usuário");
      }

      // Criar convite
      const { error: inviteError } = await supabase
        .from("group_invitations")
        .insert({
          group_id: groupId,
          inviter_id: user.id,
          invitee_id: userId,
          status: "pending",
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 dias
        });

      if (inviteError) {
        throw inviteError;
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("Erro ao convidar usuário:", error);
      return { data: null, error: error as Error };
    }
  }

  // Remover usuário do grupo
  static async removeMember(groupId: string, userId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Verificar se o usuário tem permissão para remover membros
      const { data: member } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single();

      if (!member || (member.role !== "admin" && member.role !== "moderator")) {
        throw new Error("Sem permissão para remover membros");
      }

      // Verificar se está tentando remover a si mesmo
      if (userId === user.id) {
        throw new Error("Não pode remover a si mesmo");
      }

      // Verificar se está tentando remover outro admin/moderador (apenas admin pode)
      const { data: targetMember } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", userId)
        .single();

      if (targetMember?.role === "admin" && member.role !== "admin") {
        throw new Error("Apenas admin pode remover outros admins");
      }

      // Remover usuário do grupo
      const { error: removeError } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", userId);

      if (removeError) {
        throw removeError;
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("Erro ao remover membro:", error);
      return { data: null, error: error as Error };
    }
  }

  // Atualizar role de membro
  static async updateMemberRole(
    groupId: string,
    userId: string,
    newRole: "admin" | "moderator" | "member"
  ) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Apenas admin pode alterar roles
      const { data: member } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single();

      if (!member || member.role !== "admin") {
        throw new Error("Apenas admin pode alterar roles");
      }

      // Não pode alterar seu próprio role
      if (userId === user.id) {
        throw new Error("Não pode alterar seu próprio role");
      }

      // Atualizar role
      const { error: updateError } = await supabase
        .from("group_members")
        .update({ role: newRole })
        .eq("group_id", groupId)
        .eq("user_id", userId);

      if (updateError) {
        throw updateError;
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("Erro ao atualizar role:", error);
      return { data: null, error: error as Error };
    }
  }

  // Buscar grupos públicos para explorar
  static async searchPublicGroups(searchTerm: string = "") {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      let query = supabase
        .from("study_groups")
        .select(
          `
          *,
          owner_profile:profiles!study_groups_owner_id_fkey(name),
          group_members(count)
        `
        )
        .eq("visibility", "public");

      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      const { data: groups, error } = await query;

      if (error) {
        throw error;
      }

      // Filtrar grupos onde o usuário não é membro
      const { data: userGroups } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id);

      const userGroupIds = userGroups?.map((g) => g.group_id) || [];
      const availableGroups =
        groups?.filter((g) => !userGroupIds.includes(g.id)) || [];

      const transformedGroups = availableGroups.map((group) => ({
        ...group,
        owner_name: group.owner_profile?.name || "Usuário",
        member_count: group.group_members?.[0]?.count || 0,
      }));

      return { data: transformedGroups, error: null };
    } catch (error) {
      console.error("Erro ao buscar grupos públicos:", error);
      return { data: [], error: error as Error };
    }
  }

  // Buscar detalhes de um grupo específico
  static async getGroupDetails(groupId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { data: group, error } = await supabase
        .from("study_groups")
        .select(
          `
          *,
          owner_profile:profiles!study_groups_owner_id_fkey(name),
          group_members(
            user_id,
            role,
            joined_at,
            user_profile:profiles!group_members_user_id_fkey(name)
          )
        `
        )
        .eq("id", groupId)
        .single();

      if (error) {
        throw error;
      }

      // Verificar se o usuário é membro
      const userMember = group.group_members?.find(
        (m) => m.user_id === user.id
      );
      const isMember = !!userMember;

      const transformedGroup = {
        ...group,
        owner_name: group.owner_profile?.name || "Usuário",
        user_role: userMember?.role || null,
        is_member: isMember,
        is_owner: group.owner_id === user.id,
        members:
          group.group_members?.map((member) => ({
            id: member.user_id,
            name: member.user_profile?.name || "Usuário",
            role: member.role,
            joined_at: member.joined_at,
          })) || [],
      };

      return { data: transformedGroup, error: null };
    } catch (error) {
      console.error("Erro ao buscar detalhes do grupo:", error);
      return { data: null, error: error as Error };
    }
  }
}
