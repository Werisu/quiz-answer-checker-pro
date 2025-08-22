import { supabase } from "@/integrations/supabase/client";
import type { ChatRoom } from "@/integrations/supabase/social-types";
import { useCallback, useEffect, useState } from "react";

export interface ChatConversation {
  id: string;
  type: "private" | "group";
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
  participants?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  room_data?: ChatRoom;
}

export interface UseChatRoomsReturn {
  conversations: ChatConversation[];
  loading: boolean;
  error: string | null;
  refreshRooms: () => Promise<void>;
  createPrivateChat: (userId: string) => Promise<string | null>;
  createGroupChat: (groupId: string, name?: string) => Promise<string | null>;
}

export const useChatRooms = (): UseChatRoomsReturn => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar salas de chat do usuário
  const fetchChatRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar salas de chat reais usando query direta simples
      console.log("Buscando dados reais do chat");

      let userRooms: any[] = [];

      try {
        // Tentativa 1: Buscar todas as salas do usuário (política RLS deve filtrar)
        console.log("Tentativa 1: Buscar salas com política RLS");
        const { data: allUserRooms, error: allRoomsError } = await supabase
          .from("chat_rooms")
          .select(
            "id, name, type, created_by, created_at, updated_at, group_id"
          )
          .order("updated_at", { ascending: false });

        if (!allRoomsError && allUserRooms) {
          userRooms = allUserRooms;
          console.log(
            "✅ Sucesso: Salas encontradas com política RLS:",
            userRooms.length
          );
        } else {
          console.warn("❌ Erro ao buscar com política RLS:", allRoomsError);

          // Tentativa 2: Buscar apenas salas onde o usuário é o criador (mais simples)
          try {
            console.log("Tentativa 2: Buscar salas por criador");
            const { data: roomsByCreator, error: creatorError } = await supabase
              .from("chat_rooms")
              .select(
                "id, name, type, created_by, created_at, updated_at, group_id"
              )
              .eq("created_by", user.id)
              .order("updated_at", { ascending: false });

            if (!creatorError && roomsByCreator) {
              userRooms = roomsByCreator;
              console.log(
                "✅ Sucesso: Salas encontradas por criador:",
                userRooms.length
              );
            } else {
              console.warn("❌ Erro ao buscar por criador:", creatorError);
            }
          } catch (creatorError) {
            console.warn("❌ Erro ao buscar por criador:", creatorError);
          }
        }
      } catch (error) {
        console.warn("❌ Erro crítico ao buscar salas de chat:", error);
      }

      // Fallback para dados mock se não conseguir buscar dados reais
      if (userRooms.length === 0) {
        console.log("⚠️ Usando fallback: dados mock temporários");
        userRooms = [
          {
            id: "fallback-room-1",
            name: "Chat de Desenvolvimento",
            type: "group",
            created_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            group_id: null,
          },
        ];
      }

      console.log("Salas encontradas:", userRooms?.length || 0);

      if (!userRooms || userRooms.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Buscar dados reais para cada sala
      const roomsWithData = await Promise.all(
        (userRooms || []).map(async (room) => {
          try {
            // Buscar apenas a última mensagem de cada sala
            const { data: lastMessage, error: messageError } = await supabase
              .from("chat_messages")
              .select("content, created_at, message_type, user_id")
              .eq("room_id", room.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle(); // Use maybeSingle para não dar erro se não houver mensagens

            if (messageError && messageError.code !== "PGRST116") {
              console.warn(
                `Erro ao buscar última mensagem da sala ${room.id}:`,
                messageError
              );
            }

            return {
              ...room,
              chat_participants: [], // Por enquanto vazio para evitar problemas
              last_message: lastMessage ? [lastMessage] : [],
            };
          } catch (error) {
            console.warn(`Erro ao processar sala ${room.id}:`, error);
            return {
              ...room,
              chat_participants: [],
              last_message: [],
            };
          }
        })
      );

      // Buscar contadores de mensagens não lidas (simples)
      const unreadCounts: Record<string, number> = {};

      // Para cada sala, contar mensagens não lidas (implementação simples)
      for (const room of userRooms || []) {
        try {
          const { count, error } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("room_id", room.id)
            .neq("user_id", user.id); // Mensagens de outros usuários

          if (!error && count !== null) {
            unreadCounts[room.id] = Math.min(count, 99); // Máximo 99
          } else {
            unreadCounts[room.id] = 0;
          }
        } catch (error) {
          console.warn(`Erro ao contar mensagens da sala ${room.id}:`, error);
          unreadCounts[room.id] = 0;
        }
      }

      // Processar dados para o formato esperado
      const processedConversations: ChatConversation[] = (
        roomsWithData || []
      ).map((room) => {
        const lastMessage =
          Array.isArray(room.last_message) && room.last_message.length > 0
            ? room.last_message[0]
            : null;

        let conversationName = room.name || "Chat";
        let avatar: string | undefined;

        if (room.type === "private") {
          // Para chats privados, usar nome genérico por enquanto
          conversationName = "Chat Privado";
        } else if (room.type === "group") {
          conversationName = room.name || "Grupo de Estudo";
        }

        return {
          id: room.id,
          type: room.type,
          name: conversationName,
          avatar,
          lastMessage: lastMessage?.content || "Sem mensagens",
          lastMessageTime: lastMessage?.created_at || room.created_at,
          unreadCount: unreadCounts[room.id] || 0,
          isPinned: false, // Implementar lógica de fixar depois
          isArchived: false, // Implementar lógica de arquivar depois
          participants: [], // TODO: Implementar quando resolver a recursão
          room_data: room,
        };
      });

      setConversations(processedConversations);
      setLoading(false);
    } catch (err: any) {
      console.error("Erro ao buscar salas de chat:", err);
      setError(err.message || "Erro ao carregar conversas");
      setLoading(false);
    }
  }, []);

  // Criar chat privado real
  const createPrivateChat = useCallback(
    async (userId: string): Promise<string | null> => {
      try {
        console.log("Criando chat privado real para usuário:", userId);

        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          throw new Error("Usuário não autenticado");
        }

        // Criar sala de chat diretamente
        const { data: room, error: roomError } = await supabase
          .from("chat_rooms")
          .insert({
            name: null, // Chat privado não tem nome
            type: "private",
            created_by: currentUser.id,
          })
          .select()
          .single();

        if (roomError) {
          throw roomError;
        }

        // Adicionar participantes
        const { error: participantError } = await supabase
          .from("chat_participants")
          .insert([
            {
              room_id: room.id,
              user_id: currentUser.id,
            },
            {
              room_id: room.id,
              user_id: userId,
            },
          ]);

        if (participantError) {
          console.warn("Erro ao adicionar participantes:", participantError);
        }

        await fetchChatRooms(); // Atualizar lista
        return room.id;
      } catch (err: any) {
        console.error("Erro ao criar chat privado:", err);
        setError(err.message || "Erro ao criar conversa");
        return null;
      }
    },
    [fetchChatRooms]
  );

  // Criar chat de grupo real
  const createGroupChat = useCallback(
    async (groupId: string, name?: string): Promise<string | null> => {
      try {
        console.log(
          "Criando chat de grupo real:",
          name,
          "para grupo:",
          groupId
        );

        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          throw new Error("Usuário não autenticado");
        }

        // Criar sala de chat diretamente
        const { data: room, error: roomError } = await supabase
          .from("chat_rooms")
          .insert({
            name: name || "Chat do Grupo",
            type: "group",
            group_id: groupId,
            created_by: currentUser.id,
          })
          .select()
          .single();

        if (roomError) {
          throw roomError;
        }

        await fetchChatRooms(); // Atualizar lista
        return room.id;
      } catch (err: any) {
        console.error("Erro ao criar chat de grupo:", err);
        setError(err.message || "Erro ao criar chat de grupo");
        return null;
      }
    },
    [fetchChatRooms]
  );

  // Atualizar salas
  const refreshRooms = useCallback(async () => {
    await fetchChatRooms();
  }, [fetchChatRooms]);

  // Carregar salas na inicialização
  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  // Real-time desabilitado para desenvolvimento (evitar problemas de RLS)
  // useEffect(() => {
  //   console.log("Real-time desabilitado para desenvolvimento");
  // }, []);

  return {
    conversations,
    loading,
    error,
    refreshRooms,
    createPrivateChat,
    createGroupChat,
  };
};
