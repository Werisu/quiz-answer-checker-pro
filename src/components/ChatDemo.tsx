import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useChatRooms } from '@/hooks/useChatRooms';
import {
    ArrowLeft,
    MessageCircle,
    Plus,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatRoom } from './ChatRoom';
import { ChatSidebar } from './ChatSidebar';

interface ChatConversation {
  id: string;
  type: 'private' | 'group';
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
}

export const ChatDemo: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  // Usar dados reais das salas de chat
  const { 
    conversations, 
    loading: conversationsLoading, 
    error: conversationsError,
    refreshRooms,
    createPrivateChat,
    createGroupChat
  } = useChatRooms();

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setShowSidebar(false);
  };

  const handleNewChat = () => {
    // TODO: Implementar modal para criar nova conversa
    // Por enquanto, apenas atualizar a lista
    refreshRooms();
    console.log('Nova conversa - atualizar lista');
  };

  const handleBackToChats = () => {
    setActiveChatId(null);
    setShowSidebar(true);
  };

  const handleGoBack = () => {
    navigate('/social');
  };

  const getActiveChat = () => {
    return conversations.find(conv => conv.id === activeChatId);
  };

  const getActiveChatParticipants = () => {
    const chat = getActiveChat();
    if (!chat) return [];

    if (chat.type === 'private') {
      return [{
        id: 'user1',
        name: chat.name,
        avatar: chat.avatar,

        role: 'member'
      }];
    } else {
      return chat.participants || [];
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Faça login para acessar o chat</p>
      </div>
    );
  }

  // Loading state
  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>Carregando conversas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (conversationsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro ao carregar conversas: {conversationsError}</p>
          <Button onClick={refreshRooms}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800 mr-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">💬</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Chat</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sistema de Mensagens</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {activeChatId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToChats}
                  className="lg:hidden"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Conversas
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Sidebar - Desktop ou quando não há chat ativo */}
        {(showSidebar || !activeChatId) && (
          <div className="w-full lg:w-80">
            <ChatSidebar
              conversations={conversations}
              activeChatId={activeChatId || undefined}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              onSearch={(query) => console.log('Search:', query)}
              loading={conversationsLoading}
            />
          </div>
        )}

        {/* Chat Room - Quando há chat ativo */}
        {activeChatId && (
          <div className="flex-1 lg:block">
            <ChatRoom
              roomId={activeChatId}
              roomType={getActiveChat()?.type || 'private'}
              participants={getActiveChatParticipants()}
              onClose={handleBackToChats}
            />
          </div>
        )}

        {/* Empty State - Quando não há chat selecionado no desktop */}
        {!activeChatId && !showSidebar && (
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Escolha uma conversa da lista para começar a conversar
              </p>
              <Button onClick={() => setShowSidebar(true)}>
                Ver conversas
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-around py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowSidebar(true);
              setActiveChatId(null);
            }}
            className={`flex flex-col items-center space-y-1 ${
              showSidebar && !activeChatId ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Conversas</span>
          </Button>
          
          {activeChatId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(false)}
              className="flex flex-col items-center space-y-1 text-blue-600"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">Chat</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
