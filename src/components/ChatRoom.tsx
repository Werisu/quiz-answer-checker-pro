import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  Video
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { MessageList } from './MessageList';


interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  role?: 'admin' | 'moderator' | 'member';
}

interface ChatRoomProps {
  roomId?: string;
  roomType: 'private' | 'group';
  participants?: ChatParticipant[];
  onClose?: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId,
  roomType,
  participants = [],
  onClose
}) => {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Usar dados reais do chat
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sendMessage,
    loadMoreMessages,
    hasMoreMessages,
    markAsRead
  } = useChat(roomId || null);

  // Marcar mensagens como lidas quando entrar na sala
  useEffect(() => {
    if (roomId && messages.length > 0) {
      markAsRead();
    }
  }, [roomId, messages.length, markAsRead]);

  // Mock participants para demonstração
  const mockParticipants: ChatParticipant[] = [
    {
      id: 'user1',
      name: 'João Silva',
      avatar: 'https://github.com/shadcn.png',
      
      role: 'admin'
    },
    {
      id: 'user2',
      name: 'Maria Santos',
      avatar: 'https://github.com/shadcn.png',
      
      
      role: 'member'
    }
  ];

  const currentParticipants = participants.length > 0 ? participants : mockParticipants;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!user || !content.trim()) return;

    const success = await sendMessage(content.trim(), type);
    if (success) {
      setMessageInput(''); // Limpar input após envio
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageInput.trim()) {
        handleSendMessage(messageInput.trim());
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header Mobile */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800 mr-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={currentParticipants[0]?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {currentParticipants[0]?.name?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {roomType === 'private' 
                    ? currentParticipants[0]?.name 
                    : 'Grupo de Estudo'
                  }
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {roomType === 'private' 
                    ? 'Ativo'
                    : `${currentParticipants.length} membros`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <Video className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={currentParticipants[0]?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {currentParticipants[0]?.name?.charAt(0) || 'C'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {roomType === 'private' 
                ? currentParticipants[0]?.name 
                : 'Grupo de Estudo'
              }
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {roomType === 'private' 
                ? 'Ativo'
                : `${currentParticipants.length} membros`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4 mr-2" />
            Ligar
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4 mr-2" />
            Vídeo
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Loading State */}
          {messagesLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Carregando mensagens...</p>
              </div>
            </div>
          ) : messagesError ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-500 mb-4">Erro ao carregar mensagens: {messagesError}</p>
                <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Load More Button */}
              {hasMoreMessages && (
                <div className="p-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadMoreMessages}
                  >
                    Carregar mensagens antigas
                  </Button>
                </div>
              )}
              
              {/* Messages */}
              <MessageList 
                messages={messages}
                participants={currentParticipants}
                onMessageClick={(message) => console.log('Message clicked:', message)}
                className="flex-1 min-h-0"
              />
            </>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center space-x-2">
              {/* Attachment Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log('Attachment button clicked')}
                disabled={!user}
                className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>

              {/* Message Input Field */}
              <div className="flex-1 relative">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  disabled={!user || messagesLoading}
                  className="pr-12 rounded-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
                
                {/* Send Button */}
                <Button
                  onClick={() => messageInput.trim() && handleSendMessage(messageInput.trim())}
                  disabled={!user || !messageInput.trim() || messagesLoading}
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>

            {/* Typing Indicator */}
            {isTyping && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-4">
                Digitando...
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:block w-80 border-l border-gray-200 dark:border-gray-800">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="participants">Participantes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="h-full">
              <div className="p-4">
                <h3 className="font-semibold mb-4">Informações do Chat</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tipo</span>
                    <Badge variant="secondary">
                      {roomType === 'private' ? 'Privado' : 'Grupo'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mensagens</span>
                    <span className="text-sm font-medium">{messages.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Criado em</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="participants" className="h-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Participantes</h3>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {currentParticipants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className="text-xs">
                            {participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {participant.name}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Ativo
                            </span>
                            {participant.role && (
                              <Badge variant="outline" className="text-xs">
                                {participant.role}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
