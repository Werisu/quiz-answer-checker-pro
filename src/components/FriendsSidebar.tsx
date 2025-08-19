import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFriends } from '@/hooks/useFriends';
import type { Friend } from '@/integrations/supabase/social-types';
import {
    Bell,
    ChevronRight,
    Circle,
    MessageCircle,
    Search,
    Settings,
    UserPlus,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { AddFriendModal } from './AddFriendModal';

interface FriendsSidebarProps {
  className?: string;
  onFriendSelect?: (friendId: string) => void;
  onSendMessage?: (friendId: string) => void;
  onViewProfile?: (userId: string) => void;
}

export const FriendsSidebar: React.FC<FriendsSidebarProps> = ({
  className = '',
  onFriendSelect,
  onSendMessage,
  onViewProfile
}) => {
  const { friends, pendingRequests } = useFriends();
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    online: true,
    offline: false,
    requests: true
  });

  // Filtrar amigos online e offline
  const onlineFriends = friends.filter(friend => friend.is_online);
  const offlineFriends = friends.filter(friend => !friend.is_online);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  const handleFriendClick = (friend: Friend) => {
    if (onFriendSelect) {
      onFriendSelect(friend.id);
    }
  };

  const renderFriendItem = (friend: Friend, showStatus = true) => (
    <div
      key={friend.id}
      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
      onClick={() => handleFriendClick(friend)}
    >
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {getInitials(friend.name)}
          </AvatarFallback>
        </Avatar>
        {showStatus && (
          <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(friend.is_online || false)}`} />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{friend.name}</p>
        {!friend.is_online && friend.last_seen && (
          <p className="text-xs text-muted-foreground truncate">
            {formatLastSeen(friend.last_seen)}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onSendMessage && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onSendMessage(friend.id);
            }}
          >
            <MessageCircle className="h-3 w-3" />
          </Button>
        )}
        
        {onViewProfile && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(friend.id);
            }}
          >
            <Users className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );

  const renderSectionHeader = (
    title: string, 
    count: number, 
    icon: React.ReactNode, 
    section: keyof typeof expandedSections,
    badge?: React.ReactNode
  ) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg transition-colors"
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
        {badge}
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="text-xs">
          {count}
        </Badge>
        <ChevronRight 
          className={`h-4 w-4 transition-transform ${
            expandedSections[section] ? 'rotate-90' : ''
          }`} 
        />
      </div>
    </button>
  );

  return (
    <div className={`w-full lg:w-80 bg-background border-r border-border flex flex-col ${className}`}>
      {/* Header da Sidebar - Responsivo */}
      <div className="p-3 lg:p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base lg:text-lg font-semibold flex items-center space-x-1 lg:space-x-2">
            <Users className="h-4 w-4 lg:h-5 lg:w-5" />
            <span>Social</span>
          </h2>
          <Button variant="ghost" size="sm" className="h-7 w-7 lg:h-8 lg:w-8 p-0">
            <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
        
        {/* Botão Adicionar Amigo */}
        <AddFriendModal
          open={addFriendModalOpen}
          onOpenChange={setAddFriendModalOpen}
          trigger={
            <Button className="w-full" size="sm">
              <UserPlus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Adicionar Amigo</span>
              <span className="sm:hidden">Adicionar</span>
            </Button>
          }
        />
      </div>

      {/* Conteúdo da Sidebar */}
      <ScrollArea className="flex-1">
        <div className="p-2 sm:p-3 lg:p-4 space-y-3 lg:space-y-4">
          {/* Estatísticas Rápidas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total de Amigos</span>
                <Badge variant="secondary">{friends.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Online</span>
                <Badge variant="default" className="bg-green-600">
                  {onlineFriends.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Solicitações</span>
                <Badge variant="destructive">
                  {pendingRequests.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Amigos Online */}
          <Card>
            <CardHeader className="pb-2">
              {renderSectionHeader(
                'Amigos Online',
                onlineFriends.length,
                <Circle className="h-3 w-3 text-green-500 fill-current" />,
                'online'
              )}
            </CardHeader>
            {expandedSections.online && (
              <CardContent className="pt-0">
                {onlineFriends.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum amigo online
                  </p>
                ) : (
                  <div className="space-y-1">
                    {onlineFriends.map(friend => renderFriendItem(friend, true))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Amigos Offline */}
          {offlineFriends.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                {renderSectionHeader(
                  'Amigos Offline',
                  offlineFriends.length,
                  <Circle className="h-3 w-3 text-gray-400 fill-current" />,
                  'offline'
                )}
              </CardHeader>
              {expandedSections.offline && (
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {offlineFriends.slice(0, 5).map(friend => renderFriendItem(friend, false))}
                    {offlineFriends.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        +{offlineFriends.length - 5} mais
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Solicitações Pendentes */}
          {pendingRequests.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                {renderSectionHeader(
                  'Solicitações',
                  pendingRequests.length,
                  <Bell className="h-3 w-3 text-orange-500" />,
                  'requests',
                  <Badge variant="destructive" className="ml-1">
                    {pendingRequests.length}
                  </Badge>
                )}
              </CardHeader>
              {expandedSections.requests && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {pendingRequests.slice(0, 3).map(request => (
                      <div
                        key={request.id}
                        className="flex items-center space-x-3 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                            {getInitials(request.requester_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {request.requester_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Quer ser seu amigo
                          </p>
                        </div>
                      </div>
                    ))}
                    {pendingRequests.length > 3 && (
                      <Button variant="outline" size="sm" className="w-full">
                        Ver todas ({pendingRequests.length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Ações Rápidas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Buscar Usuários
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Rápido
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Ver Todos os Amigos
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Footer da Sidebar */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Status: Sincronizado</span>
          <div className="flex items-center space-x-1">
            <Circle className="h-2 w-2 text-green-500 fill-current" />
            <span>Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
