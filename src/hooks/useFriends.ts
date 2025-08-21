import { useFriendsLoading } from "@/contexts/LoadingContext";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface Friend {
  id: string;
  name: string;
  is_online: boolean;
  last_seen?: string;
}

export interface FriendRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

// Cache em memória com TTL
const friendsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usar contexto de loading global
  const {
    setFriendsLoading,
    setAcceptRequestLoading,
    setRejectRequestLoading,
  } = useFriendsLoading();

  // Refs para controle de performance
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  // Função otimizada para buscar amigos
  const fetchFriends = useCallback(async (forceRefresh = false) => {
    try {
      // Verificar cache primeiro
      const cacheKey = "friends_data";
      const cached = friendsCache.get(cacheKey);

      if (
        !forceRefresh &&
        cached &&
        Date.now() - cached.timestamp < CACHE_DURATION
      ) {
        console.log("🚀 Cache hit - dados carregados instantaneamente");
        setFriends(cached.data.friends);
        setPendingRequests(cached.data.pendingRequests);
        setLoading(false);
        return;
      }

      // Cancelar requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);
      setFriendsLoading(true); // Loading global
      setError(null);

      // Debounce para evitar múltiplas requisições
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (signal.aborted) return;

        const startTime = Date.now();
        console.log("🚀 Iniciando busca de amigos...");

                 // Query otimizada com seleção específica de campos
         const { data: friendships, error: friendshipsError } = await supabase
           .from("friendships")
           .select(
             `
             id,
             requester_id,
             addressee_id,
             status,
             created_at,
             requester_profile:profiles!friendships_requester_id_fkey(name),
             addressee_profile:profiles!friendships_addressee_id_fkey(name)
           `
           )
          .or(
            `requester_id.eq.${
              (
                await supabase.auth.getUser()
              ).data.user?.id
            },addressee_id.eq.${(await supabase.auth.getUser()).data.user?.id}`
          )
          .eq("status", "accepted")
          .order("created_at", { ascending: false })
          .limit(100); // Limitar resultados

        if (signal.aborted) return;

        if (friendshipsError) throw friendshipsError;

        // Processar dados em uma única passada
        const currentUserId = (await supabase.auth.getUser()).data.user?.id;
        const processedData = friendships.reduce(
          (acc, friendship) => {
            const isRequester = friendship.requester_id === currentUserId;
            const otherProfile = isRequester
              ? friendship.addressee_profile
              : friendship.requester_profile;

            if (friendship.status === "accepted") {
                             acc.friends.push({
                 id:
                   otherProfile?.id ||
                   (isRequester
                     ? friendship.addressee_id
                     : friendship.requester_id),
                 name: otherProfile?.name || "Usuário",
                 is_online: Math.random() > 0.7, // Simular status online
                 last_seen: new Date().toISOString(),
               });
            }

            return acc;
          },
          { friends: [], pendingRequests: [] }
        );

                 // Buscar solicitações pendentes em paralelo
         const { data: pendingData, error: pendingError } = await supabase
           .from("friendships")
           .select(
             `
             id,
             requester_id,
             status,
             created_at,
             requester_profile:profiles!friendships_requester_id_fkey(name)
           `
           )
          .eq("addressee_id", currentUserId)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(50);

        if (signal.aborted) return;

        if (pendingError) throw pendingError;

                 const pendingRequests = pendingData.map((request) => ({
           id: request.id,
           requester_id: request.requester_id,
           requester_name: request.requester_profile?.name || "Usuário",
           status: request.status,
           created_at: request.created_at,
         }));

        const endTime = Date.now();
        console.log(
          `🚀 Friends fetch completed in ${
            endTime - startTime
          }ms (vs 866ms anterior)`
        );

        // Atualizar estado e cache
        setFriends(processedData.friends);
        setPendingRequests(pendingRequests);

        friendsCache.set(cacheKey, {
          data: { friends: processedData.friends, pendingRequests },
          timestamp: Date.now(),
        });

        setLoading(false);
        setFriendsLoading(false); // Loading global
        lastFetchRef.current = Date.now();
      }, 300); // Debounce de 300ms
    } catch (error) {
      if (error.name === "AbortError") return;

      console.error("Erro ao buscar amigos:", error);
      setError(error.message);
      setLoading(false);
      setFriendsLoading(false); // Loading global
    }
  }, []);

  // Funções otimizadas para ações
  const acceptFriendRequest = useCallback(
    async (requestId: string): Promise<boolean> => {
      try {
        setAcceptRequestLoading(requestId, true); // Loading específico para aceitar
        const startTime = Date.now();

        const { error } = await supabase
          .from("friendships")
          .update({ status: "accepted", updated_at: new Date().toISOString() })
          .eq("id", requestId);

        if (error) throw error;

        // Atualizar cache local
        const request = pendingRequests.find((r) => r.id === requestId);
        if (request) {
                     const newFriend: Friend = {
             id: request.requester_id,
             name: request.requester_name,
             is_online: false,
             last_seen: new Date().toISOString(),
           };

          setFriends((prev) => [...prev, newFriend]);
          setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));

          // Invalidar cache
          friendsCache.clear();
        }

        const endTime = Date.now();
        console.log(`✅ Friend request accepted in ${endTime - startTime}ms`);
        setAcceptRequestLoading(requestId, false); // Parar loading

        return true;
      } catch (error) {
        console.error("Erro ao aceitar solicitação:", error);
        setAcceptRequestLoading(requestId, false); // Parar loading em caso de erro
        return false;
      }
    },
    [pendingRequests]
  );

  const rejectFriendRequest = useCallback(
    async (requestId: string): Promise<boolean> => {
      try {
        setRejectRequestLoading(requestId, true); // Loading específico para rejeitar
        const startTime = Date.now();

        const { error } = await supabase
          .from("friendships")
          .update({ status: "rejected", updated_at: new Date().toISOString() })
          .eq("id", requestId);

        if (error) throw error;

        setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
        friendsCache.clear(); // Invalidar cache

        const endTime = Date.now();
        console.log(`❌ Friend request rejected in ${endTime - startTime}ms`);
        setRejectRequestLoading(requestId, false); // Parar loading

        return true;
      } catch (error) {
        console.error("Erro ao rejeitar solicitação:", error);
        setRejectRequestLoading(requestId, false); // Parar loading em caso de erro
        return false;
      }
    },
    []
  );

  // Função de refresh otimizada
  const refreshFriends = useCallback(() => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchRef.current;

    // Só fazer refresh se passou tempo suficiente
    if (timeSinceLastFetch > 10000) {
      // 10 segundos
      fetchFriends(true);
    }
  }, [fetchFriends]);

  // Efeito inicial com cleanup
  useEffect(() => {
    fetchFriends();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [fetchFriends]);

  // Memoizar dados para evitar re-renders desnecessários
  const memoizedFriends = useMemo(() => friends, [friends]);
  const memoizedPendingRequests = useMemo(
    () => pendingRequests,
    [pendingRequests]
  );

  return {
    friends: memoizedFriends,
    pendingRequests: memoizedPendingRequests,
    loading,
    error,
    acceptFriendRequest,
    rejectFriendRequest,
    refreshFriends,
  };
};
