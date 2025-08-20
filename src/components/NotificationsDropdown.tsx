import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, MessageCircle, User, Users, X } from 'lucide-react';
import React, { useState } from 'react';

interface Notification {
  id: string;
  type: 'friend_request' | 'message' | 'online_friend' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  userId?: string;
  actionRequired?: boolean;
}

interface NotificationsDropdownProps {
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onViewProfile: (userId: string) => void;
  onSendMessage: (userId: string) => void;
  onMarkAsRead: (notificationId: string) => void;
  onDismiss: (notificationId: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  onAcceptRequest,
  onRejectRequest,
  onViewProfile,
  onSendMessage,
  onMarkAsRead,
  onDismiss,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Simular notificações (substituir por dados reais)
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'friend_request',
      title: 'Nova solicitação de amizade',
      message: 'João Silva quer ser seu amigo',
      timestamp: '2 min atrás',
      isRead: false,
      userId: 'user1',
      actionRequired: true,
    },
    {
      id: '2',
      type: 'message',
      title: 'Nova mensagem',
      message: 'Maria Santos enviou uma mensagem',
      timestamp: '5 min atrás',
      isRead: false,
      userId: 'user2',
    },
    {
      id: '3',
      type: 'online_friend',
      title: 'Amigo online',
      message: 'Pedro Costa está online agora',
      timestamp: '10 min atrás',
      isRead: true,
      userId: 'user3',
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Nova conquista',
      message: 'Você desbloqueou "Primeiro Amigo"',
      timestamp: '1 hora atrás',
      isRead: false,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'online_friend':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'achievement':
        return <Bell className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAcceptRequest = (notificationId: string) => {
    onAcceptRequest(notificationId);
    onMarkAsRead(notificationId);
  };

  const handleRejectRequest = (notificationId: string) => {
    onRejectRequest(notificationId);
    onDismiss(notificationId);
  };

  const handleMarkAsRead = (notificationId: string) => {
    onMarkAsRead(notificationId);
  };

  const handleDismiss = (notificationId: string) => {
    onDismiss(notificationId);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-80 max-h-96 p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Notificações</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              {unreadCount} nova{unreadCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div key={notification.id} className="relative">
                  <DropdownMenuItem 
                    className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            !notification.isRead 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {notification.timestamp}
                          </p>
                        </div>

                        {/* Actions */}
                        {notification.actionRequired && (
                          <div className="flex items-center space-x-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptRequest(notification.id);
                              }}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectRequest(notification.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Additional Actions */}
                      {notification.userId && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewProfile(notification.userId!);
                            }}
                          >
                            Ver perfil
                          </Button>
                          {notification.type === 'message' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSendMessage(notification.userId!);
                              }}
                            >
                              Responder
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Dismiss Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(notification.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              Ver todas as notificações
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
