import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ChatConversation } from '@/hooks/useChatRooms';
import { MessageCircle, Plus, Users } from 'lucide-react';
import React from 'react';

interface ChatSelectorProps {
  conversations: ChatConversation[];
  activeChatId?: string;
  onSelectChat: (conversationId: string) => void;
  onStartNewChat: () => void;
  loading?: boolean;
}

export const ChatSelector: React.FC<ChatSelectorProps> = ({
  conversations,
  activeChatId,
  onSelectChat,
  onStartNewChat,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma conversa ainda
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Inicie uma conversa com seus amigos ou grupos de estudo
          </p>
          <Button onClick={onStartNewChat} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Conversa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Conversas</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {conversations.length} conversa{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={onStartNewChat} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova
          </Button>
        </div>
      </div>

      {/* Lista de Conversas */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeChatId;
            return (
              <div
                key={conversation.id}
                onClick={() => onSelectChat(conversation.id)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {conversation.type === 'private' 
                        ? conversation.name.charAt(0).toUpperCase()
                        : <Users className="w-6 h-6" />
                      }
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conversation.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={conversation.type === 'private' ? 'secondary' : 'default'}
                          className="text-xs"
                        >
                          {conversation.type === 'private' ? 'Privado' : 'Grupo'}
                        </Badge>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(conversation.lastMessageTime).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
