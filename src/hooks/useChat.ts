import { ChatService } from "@/integrations/supabase/services/ChatService";
import type { ChatMessage } from "@/integrations/supabase/social-types";
import { useCallback, useEffect, useState } from "react";

export interface UseChatReturn {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (
    content: string,
    messageType?: "text" | "image" | "file"
  ) => Promise<boolean>;
  loadMoreMessages: () => Promise<void>;
  hasMoreMessages: boolean;
  markAsRead: () => Promise<void>;
}

export const useChat = (roomId: string | null): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();

  // Buscar mensagens da sala
  const fetchMessages = useCallback(
    async (roomId: string, loadMore = false) => {
      try {
        if (!loadMore) {
          setLoading(true);
          setError(null);
        }

        const response = await ChatService.getRoomMessages(
          roomId,
          50,
          loadMore ? cursor : undefined
        );

        if (loadMore) {
          setMessages((prev) => [...response.messages, ...prev]);
        } else {
          setMessages(response.messages);
        }

        setHasMoreMessages(response.has_more);
        setCursor(response.cursor);

        if (!loadMore) {
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Erro ao buscar mensagens:", err);
        setError(err.message || "Erro ao carregar mensagens");
        setLoading(false);
      }
    },
    [cursor]
  );

  // Enviar mensagem
  const sendMessage = useCallback(
    async (
      content: string,
      messageType: "text" | "image" | "file" = "text"
    ): Promise<boolean> => {
      if (!roomId || !content.trim()) return false;

      try {
        const newMessage = await ChatService.sendMessage({
          room_id: roomId,
          content: content.trim(),
          message_type: messageType,
        });

        // Adicionar a nova mensagem à lista
        setMessages((prev) => [...prev, newMessage]);
        return true;
      } catch (err: any) {
        console.error("Erro ao enviar mensagem:", err);
        setError(err.message || "Erro ao enviar mensagem");
        return false;
      }
    },
    [roomId]
  );

  // Carregar mais mensagens antigas
  const loadMoreMessages = useCallback(async () => {
    if (!roomId || !hasMoreMessages || loading) return;

    await fetchMessages(roomId, true);
  }, [roomId, hasMoreMessages, loading, fetchMessages]);

  // Marcar mensagens como lidas
  const markAsRead = useCallback(async () => {
    if (!roomId) return;

    try {
      await ChatService.markMessagesAsRead(roomId);
    } catch (err: any) {
      console.error("Erro ao marcar como lida:", err);
    }
  }, [roomId]);

  // Carregar mensagens quando o roomId mudar
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages(roomId);
  }, [roomId, fetchMessages]);

  // Real-time desabilitado para evitar problemas de múltiplas inscrições
  // useEffect(() => {
  //   if (!roomId) return;
  //   console.log("Real-time desabilitado para desenvolvimento");
  // }, [roomId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    loadMoreMessages,
    hasMoreMessages,
    markAsRead,
  };
};
