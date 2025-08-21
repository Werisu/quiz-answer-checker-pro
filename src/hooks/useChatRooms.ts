import { supabase } from "@/integrations/supabase/client";
import { ChatService } from "@/integrations/supabase/services/ChatService";
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

      // Buscar salas de chat com dados completos
      const { data: chatRooms, error: roomsError } = await supabase
        .from("chat_rooms")
        .select(
          `
          *,
          chat_participants!inner (
            user_id,
            joined_at,
            last_read_at,
            profiles:user_id (
              name
            )
          ),
          last_message:chat_messages (
            content,
            created_at,
            message_type,
            profiles:user_id (
              name
            )
          )
        `
        )
        .eq("chat_participants.user_id", user.id)
        .order("updated_at", { ascending: false });

      if (roomsError) throw roomsError;

      // Buscar contadores de mensagens não lidas
      const unreadCounts = await ChatService.getUnreadCounts();

      // Processar dados para o formato esperado
      const processedConversations: ChatConversation[] = (chatRooms || []).map(
        (room) => {
          const otherParticipants = room.chat_participants.filter(
            (p) => p.user_id !== user.id
          );
          const lastMessage =
            Array.isArray(room.last_message) && room.last_message.length > 0
              ? room.last_message[0]
              : null;

          let conversationName = room.name || "Chat";
          let avatar: string | undefined;

          if (room.type === "private" && otherParticipants.length > 0) {
            conversationName = otherParticipants[0].profiles?.name || "Usuário";
            // Avatar seria buscado do perfil do usuário
          } else if (room.type === "group") {
            conversationName = room.name || "Grupo";
            // Avatar do grupo seria definido
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
            participants: otherParticipants.map((p) => ({
              id: p.user_id,
              name: p.profiles?.name || "Usuário",
              avatar: undefined, // Implementar avatar depois
            })),
            room_data: room,
          };
        }
      );

      setConversations(processedConversations);
      setLoading(false);
    } catch (err: any) {
      console.error("Erro ao buscar salas de chat:", err);
      setError(err.message || "Erro ao carregar conversas");
      setLoading(false);
    }
  }, []);

  // Criar chat privado
  const createPrivateChat = useCallback(
    async (userId: string): Promise<string | null> => {
      try {
        const room = await ChatService.createPrivateChat(userId);
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

  // Criar chat de grupo
  const createGroupChat = useCallback(
    async (groupId: string, name?: string): Promise<string | null> => {
      try {
        const room = await ChatService.createGroupChat({
          type: "group",
          name,
          group_id: groupId,
        });
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

  // Configurar real-time para atualizações de salas
  useEffect(() => {
    const {
      data: { user },
    } = supabase.auth.getUser();

    user.then(({ data: { user: currentUser } }) => {
      if (!currentUser) return;

      const channel = supabase
        .channel("chat_rooms_updates")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "chat_rooms",
          },
          () => {
            // Recarregar salas quando houver mudanças
            fetchChatRooms();
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
          },
          () => {
            // Recarregar salas quando houver novas mensagens
            fetchChatRooms();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });
  }, [fetchChatRooms]);

  return {
    conversations,
    loading,
    error,
    refreshRooms,
    createPrivateChat,
    createGroupChat,
  };
};
