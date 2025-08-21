import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
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
  isOnline?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  participants?: Array<{
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  }>;
}

export const ChatDemo: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  // Mock conversations para demonstração
  const mockConversations: ChatConversation[] = [
    {
      id: 'chat1',
      type: 'private',
      name: 'João Silva',
      avatar: 'https://github.com/shadcn.png',
      lastMessage: 'Que legal! Quer estudar junto?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      unreadCount: 1,
      isOnline: true,
      isPinned: true
    },
    {
      id: 'chat2',
      type: 'private',
      name: 'Maria Santos',
      avatar: 'https://github.com/shadcn.png',
      lastMessage: 'Vou enviar o material de estudo',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 'chat3',
      type: 'group',
      name: 'Grupo de Matemática',
      avatar: 'https://github.com/shadcn.png',
      lastMessage: 'Ana: Alguém pode explicar a questão 5?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      unreadCount: 3,
      participants: [
        { id: 'user1', name: 'João', avatar: 'https://github.com/shadcn.png', isOnline: true },
        { id: 'user2', name: 'Maria', avatar: 'https://github.com/shadcn.png', isOnline: false },
        { id: 'user3', name: 'Ana', avatar: 'https://github.com/shadcn.png', isOnline: true }
      ]
    }
  ];

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setShowSidebar(false);
  };

  const handleNewChat = () => {
    // Implementar criação de nova conversa
    console.log('Nova conversa');
  };

  const handleBackToChats = () => {
    setActiveChatId(null);
    setShowSidebar(true);
  };

  const handleGoBack = () => {
    navigate('/social');
  };

  const getActiveChat = () => {
    return mockConversations.find(conv => conv.id === activeChatId);
  };

  const getActiveChatParticipants = () => {
    const chat = getActiveChat();
    if (!chat) return [];

    if (chat.type === 'private') {
      return [{
        id: 'user1',
        name: chat.name,
        avatar: chat.avatar,
        is_online: chat.isOnline || false,
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

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
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
              conversations={mockConversations}
              activeChatId={activeChatId || undefined}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              onSearch={(query) => console.log('Search:', query)}
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
