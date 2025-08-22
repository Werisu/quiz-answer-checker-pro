import { useCallback, useState } from "react";
import { useChatRooms } from "./useChatRooms";

export interface ActiveChat {
  roomId: string;
  roomType: "private" | "group";
  name: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role?: "admin" | "moderator" | "member";
  }>;
}

export const useActiveChat = () => {
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const { conversations, createPrivateChat, createGroupChat } = useChatRooms();

  const startChat = useCallback(
    async (type: "private" | "group", targetId: string, name?: string) => {
      try {
        let roomId: string | null = null;

        if (type === "private") {
          roomId = await createPrivateChat(targetId);
        } else if (type === "group") {
          roomId = await createGroupChat(targetId, name);
        }

        if (roomId) {
          // Buscar a conversa criada
          const conversation = conversations.find((conv) => conv.id === roomId);
          if (conversation) {
            setActiveChat({
              roomId: conversation.id,
              roomType: conversation.type,
              name: conversation.name,
              participants: conversation.participants || [],
            });
          }
        }
      } catch (error) {
        console.error("Erro ao iniciar chat:", error);
      }
    },
    [conversations, createPrivateChat, createGroupChat]
  );

  const closeChat = useCallback(() => {
    setActiveChat(null);
  }, []);

  const selectExistingChat = useCallback(
    (conversationId: string) => {
      const conversation = conversations.find(
        (conv) => conv.id === conversationId
      );
      if (conversation) {
        setActiveChat({
          roomId: conversation.id,
          roomType: conversation.type,
          name: conversation.name,
          participants: conversation.participants || [],
        });
      }
    },
    [conversations]
  );

  return {
    activeChat,
    startChat,
    closeChat,
    selectExistingChat,
    conversations,
  };
};
