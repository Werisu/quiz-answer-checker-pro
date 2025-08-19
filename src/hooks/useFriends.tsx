import { FriendsService } from '@/integrations/supabase/services';
import type { Friend, FriendRequest } from '@/integrations/supabase/social-types';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export const useFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar lista de amigos
  const fetchFriends = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const friendsData = await FriendsService.getFriends();
      setFriends(friendsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar amigos');
      console.error('Erro ao buscar amigos:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Buscar solicitações pendentes
  const fetchPendingRequests = useCallback(async () => {
    if (!user) return;
    
    try {
      const requests = await FriendsService.getPendingRequests();
      setPendingRequests(requests);
    } catch (err) {
      console.error('Erro ao buscar solicitações pendentes:', err);
    }
  }, [user]);

  // Enviar solicitação de amizade
  const sendFriendRequest = useCallback(async (addresseeId: string) => {
    if (!user) return false;
    
    try {
      await FriendsService.sendFriendRequest({ user_id: addresseeId });
      // Atualizar lista de solicitações pendentes
      await fetchPendingRequests();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar solicitação');
      console.error('Erro ao enviar solicitação de amizade:', err);
      return false;
    }
  }, [user, fetchPendingRequests]);

  // Aceitar solicitação de amizade
  const acceptFriendRequest = useCallback(async (requestId: string) => {
    try {
      await FriendsService.acceptFriendRequest(requestId);
      // Atualizar listas
      await Promise.all([fetchFriends(), fetchPendingRequests()]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aceitar solicitação');
      console.error('Erro ao aceitar solicitação de amizade:', err);
      return false;
    }
  }, [fetchFriends, fetchPendingRequests]);

  // Rejeitar solicitação de amizade
  const rejectFriendRequest = useCallback(async (requestId: string) => {
    try {
      await FriendsService.rejectFriendRequest(requestId);
      // Atualizar lista de solicitações pendentes
      await fetchPendingRequests();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao rejeitar solicitação');
      console.error('Erro ao rejeitar solicitação de amizade:', err);
      return false;
    }
  }, [fetchPendingRequests]);

  // Remover amigo
  const removeFriend = useCallback(async (friendId: string) => {
    try {
      await FriendsService.removeFriend(friendId);
      // Atualizar lista de amigos
      await fetchFriends();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover amigo');
      console.error('Erro ao remover amigo:', err);
      return false;
    }
  }, [fetchFriends]);

  // Bloquear usuário
  const blockUser = useCallback(async (userId: string) => {
    try {
      await FriendsService.blockUser(userId);
      // Atualizar listas
      await Promise.all([fetchFriends(), fetchPendingRequests()]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao bloquear usuário');
      console.error('Erro ao bloquear usuário:', err);
      return false;
    }
  }, [fetchFriends, fetchPendingRequests]);

  // Desbloquear usuário
  const unblockUser = useCallback(async (userId: string) => {
    try {
      await FriendsService.unblockUser(userId);
      // Atualizar listas
      await Promise.all([fetchFriends(), fetchPendingRequests()]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desbloquear usuário');
      console.error('Erro ao desbloquear usuário:', err);
      return false;
    }
  }, [fetchFriends, fetchPendingRequests]);

  // Buscar sugestões de amigos
  const getFriendSuggestions = useCallback(async () => {
    if (!user) return [];
    
    try {
      return await FriendsService.getFriendSuggestions();
    } catch (err) {
      console.error('Erro ao buscar sugestões de amigos:', err);
      return [];
    }
  }, [user]);

  // Verificar se dois usuários são amigos
  const areFriends = useCallback(async (userId: string) => {
    if (!user) return false;
    
    try {
      return await FriendsService.areFriends(userId);
    } catch (err) {
      console.error('Erro ao verificar amizade:', err);
      return false;
    }
  }, [user]);

  // Buscar status da amizade
  const getFriendshipStatus = useCallback(async (userId: string) => {
    if (!user) return null;
    
    try {
      return await FriendsService.getFriendshipStatus(userId);
    } catch (err) {
      console.error('Erro ao buscar status da amizade:', err);
      return null;
    }
  }, [user]);

  // Buscar usuários
  const searchUsers = useCallback(async (query: string) => {
    if (!user || !query.trim()) return [];
    
    try {
      return await FriendsService.searchUsers(query);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      return [];
    }
  }, [user]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchPendingRequests();
    }
  }, [user, fetchFriends, fetchPendingRequests]);

  // Limpar erro após um tempo
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    // Estado
    friends,
    pendingRequests,
    loading,
    error,
    
    // Ações
    fetchFriends,
    fetchPendingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    blockUser,
    unblockUser,
    getFriendSuggestions,
    areFriends,
    getFriendshipStatus,
    searchUsers,
    
    // Utilitários
    clearError: () => setError(null),
    refreshData: () => {
      if (user) {
        fetchFriends();
        fetchPendingRequests();
      }
    }
  };
};
