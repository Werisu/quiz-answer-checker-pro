import { StudyGroupsService } from '@/integrations/supabase/services/StudyGroupsService';
import { useCallback, useEffect, useState } from 'react';

export interface GroupMember {
  id: string;
  name: string;
  role: 'admin' | 'moderator' | 'member';
  avatar?: string;
  joined_at: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  member_count: number;
  max_members: number;
  created_at: string;
  updated_at: string;
  owner_id: string;
  owner_name: string;
  members: GroupMember[];
  tags: string[];
  is_owner: boolean;
  user_role: 'admin' | 'moderator' | 'member';
}

export interface CreateGroupData {
  name: string;
  description: string;
  visibility: 'public' | 'private';
  max_members: number;
  tags: string[];
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  group_name: string;
  inviter_id: string;
  inviter_name: string;
  invitee_id: string;
  invitee_name: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  expires_at: string;
}

export const useStudyGroups = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);

  // Buscar grupos do usuário
  const fetchUserGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: userGroups, error: groupsError } = await StudyGroupsService.getUserGroups();
      
      if (groupsError) {
        throw new Error(`Erro ao buscar grupos: ${groupsError.message}`);
      }

      // Transformar dados para o formato esperado pelo componente
      const transformedGroups: StudyGroup[] = userGroups.map((group: any) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        visibility: group.visibility,
        member_count: group.member_count || 0,
        max_members: group.max_members || 50,
        created_at: group.created_at,
        updated_at: group.updated_at,
        owner_id: group.owner_id,
        owner_name: group.owner_name || 'Usuário',
        members: group.members || [],
        tags: group.tags || [],
        is_owner: group.is_owner || false,
        user_role: group.user_role || 'member',
      }));

      setGroups(transformedGroups);
    } catch (err) {
      console.error('Erro ao buscar grupos do usuário:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar convites pendentes
  const fetchInvitations = useCallback(async () => {
    try {
      const { data: userInvitations, error: invitationsError } = await StudyGroupsService.getUserInvitations();
      
      if (invitationsError) {
        console.error('Erro ao buscar convites:', invitationsError);
        return;
      }

      const transformedInvitations: GroupInvitation[] = userInvitations.map((invitation: any) => ({
        id: invitation.id,
        group_id: invitation.group_id,
        group_name: invitation.group_name || 'Grupo',
        inviter_id: invitation.inviter_id,
        inviter_name: invitation.inviter_name || 'Usuário',
        invitee_id: invitation.invitee_id,
        invitee_name: invitation.invitee_name || 'Usuário',
        status: invitation.status,
        created_at: invitation.created_at,
        expires_at: invitation.expires_at,
      }));

      setInvitations(transformedInvitations);
    } catch (err) {
      console.error('Erro ao buscar convites:', err);
    }
  }, []);

  // Criar novo grupo
  const createGroup = useCallback(async (groupData: CreateGroupData): Promise<boolean> => {
    try {
      setError(null);
      
      const { data: newGroup, error: createError } = await StudyGroupsService.createGroup(groupData);
      
      if (createError) {
        throw new Error(`Erro ao criar grupo: ${createError.message}`);
      }

      if (newGroup) {
        // Recarregar grupos após criação
        await fetchUserGroups();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao criar grupo:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, [fetchUserGroups]);

  // Entrar em um grupo (aceitar convite ou solicitar entrada)
  const joinGroup = useCallback(async (groupId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error: joinError } = await StudyGroupsService.joinGroup(groupId);
      
      if (joinError) {
        throw new Error(`Erro ao entrar no grupo: ${joinError.message}`);
      }

      // Recarregar grupos após entrada
      await fetchUserGroups();
      return true;
    } catch (err) {
      console.error('Erro ao entrar no grupo:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, [fetchUserGroups]);

  // Sair de um grupo
  const leaveGroup = useCallback(async (groupId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error: leaveError } = await StudyGroupsService.leaveGroup(groupId);
      
      if (leaveError) {
        throw new Error(`Erro ao sair do grupo: ${leaveError.message}`);
      }

      // Recarregar grupos após saída
      await fetchUserGroups();
      return true;
    } catch (err) {
      console.error('Erro ao sair do grupo:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, [fetchUserGroups]);

  // Aceitar convite para grupo
  const acceptInvitation = useCallback(async (invitationId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error: acceptError } = await StudyGroupsService.acceptInvitation(invitationId);
      
      if (acceptError) {
        throw new Error(`Erro ao aceitar convite: ${acceptError.message}`);
      }

      // Recarregar dados após aceitar convite
      await Promise.all([fetchUserGroups(), fetchInvitations()]);
      return true;
    } catch (err) {
      console.error('Erro ao aceitar convite:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, [fetchUserGroups, fetchInvitations]);

  // Rejeitar convite para grupo
  const rejectInvitation = useCallback(async (invitationId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error: rejectError } = await StudyGroupsService.rejectInvitation(invitationId);
      
      if (rejectError) {
        throw new Error(`Erro ao rejeitar convite: ${rejectError.message}`);
      }

      // Recarregar convites após rejeitar
      await fetchInvitations();
      return true;
    } catch (err) {
      console.error('Erro ao rejeitar convite:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, [fetchInvitations]);

  // Convidar usuário para grupo
  const inviteUser = useCallback(async (groupId: string, userId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error: inviteError } = await StudyGroupsService.inviteUser(groupId, userId);
      
      if (inviteError) {
        throw new Error(`Erro ao convidar usuário: ${inviteError.message}`);
      }

      return true;
    } catch (err) {
      console.error('Erro ao convidar usuário:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, []);

  // Remover usuário do grupo (apenas admin/moderador)
  const removeMember = useCallback(async (groupId: string, userId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error: removeError } = await StudyGroupsService.removeMember(groupId, userId);
      
      if (removeError) {
        throw new Error(`Erro ao remover membro: ${removeError.message}`);
      }

      // Recarregar grupos após remoção
      await fetchUserGroups();
      return true;
    } catch (err) {
      console.error('Erro ao remover membro:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, [fetchUserGroups]);

  // Atualizar role de membro (apenas admin)
  const updateMemberRole = useCallback(async (groupId: string, userId: string, newRole: 'admin' | 'moderator' | 'member'): Promise<boolean> => {
    try {
      setError(null);
      
      const { error: updateError } = await StudyGroupsService.updateMemberRole(groupId, userId, newRole);
      
      if (updateError) {
        throw new Error(`Erro ao atualizar role: ${updateError.message}`);
      }

      // Recarregar grupos após atualização
      await fetchUserGroups();
      return true;
    } catch (err) {
      console.error('Erro ao atualizar role:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    }
  }, [fetchUserGroups]);

  // Buscar grupos públicos para explorar
  const searchPublicGroups = useCallback(async (searchTerm: string = '') => {
    try {
      setError(null);
      
      const { data: publicGroups, error: searchError } = await StudyGroupsService.searchPublicGroups(searchTerm);
      
      if (searchError) {
        throw new Error(`Erro ao buscar grupos públicos: ${searchError.message}`);
      }

      return publicGroups;
    } catch (err) {
      console.error('Erro ao buscar grupos públicos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return [];
    }
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    fetchUserGroups();
    fetchInvitations();
  }, [fetchUserGroups, fetchInvitations]);

  return {
    // Estado
    groups,
    loading,
    error,
    invitations,
    
    // Ações
    createGroup,
    joinGroup,
    leaveGroup,
    acceptInvitation,
    rejectInvitation,
    inviteUser,
    removeMember,
    updateMemberRole,
    searchPublicGroups,
    
    // Utilitários
    clearError,
    refetch: fetchUserGroups,
  };
};
