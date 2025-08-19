import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFriends } from '@/hooks/useFriends';
import {
  Bell,
  Check,
  Clock,
  MessageCircle,
  UserCheck,
  UserPlus,
  Users,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface SocialNotification {
  id: string;
  type: 'friend_request' | 'friend_accepted' | 'friend_online' | 'message_received';
  title: string;
  description: string;
  user_id: string;
  user_name: string;
  timestamp: string;
  is_read: boolean;
  action_required?: boolean;
}

interface SocialNotificationsProps {
  className?: string;
  onAcceptRequest?: (requestId: string) => void;
  onRejectRequest?: (requestId: string) => void;
  onViewProfile?: (userId: string) => void;
  onSendMessage?: (userId: string) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onDismiss?: (notificationId: string) => void;
}

export const SocialNotifications: React.FC<SocialNotificationsProps> = ({
  className = '',
  onAcceptRequest,
  onRejectRequest,
  onViewProfile,
  onSendMessage,
  onMarkAsRead,
  onDismiss
}) => {
  const { friends, pendingRequests } = useFriends();
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Simular notificações baseadas nos dados reais
  useEffect(() => {
    const mockNotifications: SocialNotification[] = [
      // Solicitações de amizade
      ...pendingRequests.map(request => ({
        id: `request_${request.id}`,
        type: 'friend_request' as const,
        title: 'Nova solicitação de amizade',
        description: `${request.requester_name} quer ser seu amigo`,
        user_id: request.requester_id,
        user_name: request.requester_name,
        timestamp: request.created_at,
        is_read: false,
        action_required: true
      })),
      
      // Amigos online (simulado)
      ...friends.filter(friend => friend.is_online).slice(0, 3).map(friend => ({
        id: `online_${friend.id}`,
        type: 'friend_online' as const,
        title: 'Amigo online',
        description: `${friend.name} está online agora`,
        user_id: friend.id,
        user_name: friend.name,
        timestamp: new Date().toISOString(),
        is_read: true,
        action_required: false
      })),
      
      // Mensagens recebidas (simulado)
      {
        id: 'message_1',
        type: 'message_received' as const,
        title: 'Nova mensagem',
        description: 'João Silva enviou uma mensagem',
        user_id: 'user_1',
        user_name: 'João Silva',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atrás
        is_read: false,
        action_required: false
      }
    ];

    setNotifications(mockNotifications);
  }, [friends, pendingRequests]);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const actionRequiredCount = notifications.filter(n => n.action_required).length;

  const getNotificationIcon = (type: SocialNotification['type']) => {
    switch (type) {
      case 'friend_request':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'friend_accepted':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'friend_online':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'message_received':
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: SocialNotification['type']) => {
    switch (type) {
      case 'friend_request':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'friend_accepted':
        return 'border-l-green-500 bg-green-50 dark:bg-green-950/20';
      case 'friend_online':
        return 'border-l-green-500 bg-green-50 dark:bg-green-950/20';
      case 'message_received':
        return 'border-l-purple-500 bg-purple-50 dark:bg-purple-950/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAcceptRequest = (notification: SocialNotification) => {
    if (onAcceptRequest && notification.type === 'friend_request') {
      onAcceptRequest(notification.id.replace('request_', ''));
    }
    markAsRead(notification.id);
  };

  const handleRejectRequest = (notification: SocialNotification) => {
    if (onRejectRequest && notification.type === 'friend_request') {
      onRejectRequest(notification.id.replace('request_', ''));
    }
    markAsRead(notification.id);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
    if (onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (onDismiss) {
      onDismiss(notificationId);
    }
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  return (
    <Card className={className}>
      <CardHeader className="pb-3 p-4 lg:p-6">
        <div className="flex flex-col xxl:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div className="flex items-center space-x-1 lg:space-x-2">
            <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
            <CardTitle className="text-base lg:text-lg">Notificações</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
            {actionRequiredCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {actionRequiredCount} ações
              </Badge>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAll(!showAll)}
            className="self-start lg:self-auto"
          >
            {showAll ? 'Ver menos' : 'Ver todas'}
          </Button>
        </div>
        <CardDescription className="text-xs lg:text-sm">
          {unreadCount} não lidas • {actionRequiredCount} requerem ação
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {displayedNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h4 className="text-sm font-medium mb-1">Nenhuma notificação</h4>
            <p className="text-xs text-muted-foreground">
              Você está em dia com suas atividades sociais
            </p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-2">
              {displayedNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.is_read ? 'ring-2 ring-primary/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {getInitials(notification.user_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {!notification.is_read && (
                              <Badge variant="secondary" className="text-xs">
                                Nova
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {notification.action_required && notification.type === 'friend_request' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => handleAcceptRequest(notification)}
                              >
                                <Check className="h-3 w-3 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => handleRejectRequest(notification)}
                              >
                                <X className="h-3 w-3 text-red-600" />
                              </Button>
                            </>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => dismissNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                              {/* Ações adicionais */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
          {onViewProfile && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-1 sm:px-2 text-xs"
              onClick={() => onViewProfile(notification.user_id)}
            >
              <Users className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Ver perfil</span>
              <span className="sm:hidden">Perfil</span>
            </Button>
          )}
          
          {onSendMessage && notification.type !== 'friend_request' && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-1 sm:px-2 text-xs"
              onClick={() => onSendMessage(notification.user_id)}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Mensagem</span>
              <span className="sm:hidden">Msg</span>
            </Button>
          )}
          
          {!notification.is_read && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-1 sm:px-2 text-xs"
              onClick={() => markAsRead(notification.id)}
            >
              <Clock className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Marcar como lida</span>
              <span className="sm:hidden">Lida</span>
            </Button>
          )}
        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {/* Ações em lote */}
        {notifications.length > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                }}
              >
                Marcar todas como lidas
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setNotifications([])}
              >
                Limpar todas
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
