import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { forwardRef } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  timestamp: string;
  message_type: 'text' | 'image' | 'file';
  is_read: boolean;
}

interface MessageListProps {
  messages: ChatMessage[];
  participants?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  onMessageClick?: (message: ChatMessage) => void;
  className?: string;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, participants = [], onMessageClick, className = '' }, ref) => {
    const { user } = useAuth();

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
        return date.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else {
        return date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        });
      }
    };

    const isOwnMessage = (message: ChatMessage) => message.sender_id === user?.id;

    const shouldShowAvatar = (message: ChatMessage, index: number) => {
      if (isOwnMessage(message)) return false;
      
      // Mostrar avatar se for a primeira mensagem do usuário ou se a mensagem anterior for de outro usuário
      if (index === 0) return true;
      
      const previousMessage = messages[index - 1];
      return previousMessage.sender_id !== message.sender_id;
    };

    const shouldShowTimestamp = (message: ChatMessage, index: number) => {
      if (index === 0) return true;
      
      const previousMessage = messages[index - 1];
      const currentTime = new Date(message.timestamp);
      const previousTime = new Date(previousMessage.timestamp);
      const diffInMinutes = (currentTime.getTime() - previousTime.getTime()) / (1000 * 60);
      
      // Mostrar timestamp se passou mais de 5 minutos ou se mudou o usuário
      return diffInMinutes > 5 || previousMessage.sender_id !== message.sender_id;
    };

    const renderMessageContent = (message: ChatMessage) => {
      switch (message.message_type) {
        case 'text':
          return (
            <div
              className={`px-4 py-2 rounded-2xl ${
                isOwnMessage(message)
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          );
        
        case 'image':
          return (
            <div className="max-w-xs">
              <img 
                src={message.content} 
                alt="Imagem" 
                className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onMessageClick?.(message)}
              />
            </div>
          );
        
        case 'file':
          return (
            <div
              className={`px-4 py-3 rounded-lg border-2 border-dashed ${
                isOwnMessage(message)
                  ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
              } cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => onMessageClick?.(message)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">📎</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Arquivo</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          );
        
        default:
          return null;
      }
    };

    const renderMessageGroup = (message: ChatMessage, index: number) => {
      const showAvatar = shouldShowAvatar(message, index);
      const showTimestamp = shouldShowTimestamp(message, index);
      const showSenderName = showAvatar && !isOwnMessage(message);

      return (
        <div
          key={message.id}
          className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'} group`}
        >
          <div className={`flex max-w-[80%] ${isOwnMessage(message) ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            {showAvatar && (
              <Avatar className="w-8 h-8 mr-2 flex-shrink-0">
                <AvatarImage src={message.sender_avatar} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {message.sender_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            
            {/* Message Content */}
            <div className={`flex flex-col ${isOwnMessage(message) ? 'items-end' : 'items-start'}`}>
              {/* Sender Name */}
              {showSenderName && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 ml-1">
                  {message.sender_name}
                </p>
              )}
              
              {/* Message Bubble */}
              <div className="relative">
                {renderMessageContent(message)}
                
                {/* Message Actions (hover) */}
                <div className={`absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isOwnMessage(message) ? '-left-8' : '-right-8'
                }`}>
                  <div className="flex items-center space-x-1">
                    <button className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
                      <span className="text-xs">👍</span>
                    </button>
                    <button className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
                      <span className="text-xs">💬</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Timestamp and Status */}
              {showTimestamp && (
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                  {isOwnMessage(message) && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.is_read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <ScrollArea className={`flex-1 ${className}`} ref={ref}>
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Nenhuma mensagem ainda
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Seja o primeiro a enviar uma mensagem!
              </p>
            </div>
          ) : (
            messages.map((message, index) => renderMessageGroup(message, index))
          )}
        </div>
      </ScrollArea>
    );
  }
);

MessageList.displayName = 'MessageList';
