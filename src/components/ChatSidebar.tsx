import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import {
    Filter,
    MessageCircle,
    MoreVertical,
    Plus,
    Search,
    Star,
    Users
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

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

interface ChatSidebarProps {
  conversations: ChatConversation[];
  activeChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat?: () => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeChatId,
  onChatSelect,
  onNewChat,
  onSearch,
  className = ''
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data para demonstração
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
    },
    {
      id: 'chat4',
      type: 'group',
      name: 'Estudos de História',
      avatar: 'https://github.com/shadcn.png',
      lastMessage: 'Pedro: Lembrete: prova amanhã às 14h',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      unreadCount: 0,
      participants: [
        { id: 'user1', name: 'João', avatar: 'https://github.com/shadcn.png', isOnline: true },
        { id: 'user4', name: 'Pedro', avatar: 'https://github.com/shadcn.png', isOnline: false }
      ]
    }
  ];

  const currentConversations = conversations.length > 0 ? conversations : mockConversations;

  const filteredConversations = useMemo(() => {
    let filtered = currentConversations;

    // Filtrar por busca
    if (searchQuery) {
      filtered = filtered.filter(conv => 
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (activeTab === 'private') {
      filtered = filtered.filter(conv => conv.type === 'private');
    } else if (activeTab === 'groups') {
      filtered = filtered.filter(conv => conv.type === 'group');
    }

    // Ordenar: fixados primeiro, depois por tempo
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });
  }, [currentConversations, searchQuery, activeTab]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'Ontem';
      if (diffInDays < 7) return `${diffInDays}d`;
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId);
  };

  const renderConversationItem = (conversation: ChatConversation) => {
    const isActive = conversation.id === activeChatId;
    const isUnread = conversation.unreadCount > 0;

    return (
      <div
        key={conversation.id}
        onClick={() => handleChatSelect(conversation.id)}
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
          isActive ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : ''
        }`}
      >
        {/* Avatar */}
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={conversation.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {conversation.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Online Status */}
          {conversation.type === 'private' && conversation.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
          )}
          
          {/* Group Indicator */}
          {conversation.type === 'group' && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
              <Users className="w-2 h-2 text-white" />
            </div>
          )}
        </div>

        {/* Conversation Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium truncate ${
              isUnread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {conversation.name}
            </h4>
            <div className="flex items-center space-x-1">
              {conversation.isPinned && (
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(conversation.lastMessageTime)}
              </span>
            </div>
          </div>
          
          <p className={`text-sm truncate ${
            isUnread ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {conversation.lastMessage}
          </p>
        </div>

        {/* Unread Badge */}
        {isUnread && (
          <Badge className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
          </Badge>
        )}

        {/* Actions Menu */}
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            // Implementar menu de ações
          }}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className={`w-full lg:w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conversas
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="w-8 h-8 p-0"
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewChat}
              className="w-8 h-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar conversas..."
            className="pl-10 pr-4"
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('all')}
            >
              Todas
            </Button>
            <Button
              variant={activeTab === 'private' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('private')}
            >
              Privadas
            </Button>
            <Button
              variant={activeTab === 'groups' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('groups')}
            >
              Grupos
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="private">Privadas</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="p-2">
              {filteredConversations.map(renderConversationItem)}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="private" className="mt-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="p-2">
              {filteredConversations.map(renderConversationItem)}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="groups" className="mt-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="p-2">
              {filteredConversations.map(renderConversationItem)}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredConversations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-center p-4">
          <MessageCircle className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
          </p>
          {!searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNewChat}
              className="mt-2"
            >
              Iniciar conversa
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
