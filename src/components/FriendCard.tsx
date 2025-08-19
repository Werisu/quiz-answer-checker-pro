import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Friend } from '@/integrations/supabase/social-types';
import { Calendar, MessageCircle, MoreHorizontal, Shield, Trophy, UserX } from 'lucide-react';
import React from 'react';

interface FriendCardProps {
  friend: Friend;
  onRemoveFriend: (friendId: string) => void;
  onBlockUser: (userId: string) => void;
  onSendMessage?: (friendId: string) => void;
  onViewProfile?: (friendId: string) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onRemoveFriend,
  onBlockUser,
  onSendMessage,
  onViewProfile
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Ausente';
      case 'busy':
        return 'Ocupado';
      default:
        return 'Offline';
    }
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(friend.name)}
                </AvatarFallback>
              </Avatar>
              {/* Indicador de status online */}
              {friend.is_online && (
                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor('online')}`} />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{friend.name}</h3>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={friend.is_online ? "default" : "secondary"}
                  className="text-xs"
                >
                  {friend.is_online ? 'Online' : getStatusText('offline')}
                </Badge>
                {friend.last_seen && !friend.is_online && (
                  <span className="text-xs text-muted-foreground">
                    {formatLastSeen(friend.last_seen)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onSendMessage && (
                <DropdownMenuItem onClick={() => onSendMessage(friend.id)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar mensagem
                </DropdownMenuItem>
              )}
              {onViewProfile && (
                <DropdownMenuItem onClick={() => onViewProfile(friend.id)}>
                  <UserX className="mr-2 h-4 w-4" />
                  Ver perfil
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onRemoveFriend(friend.id)}
                className="text-destructive focus:text-destructive"
              >
                <UserX className="mr-2 h-4 w-4" />
                Remover amigo
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onBlockUser(friend.id)}
                className="text-destructive focus:text-destructive"
              >
                <Shield className="mr-2 h-4 w-4" />
                Bloquear usuário
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Amigos desde {new Date(friend.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
            {/* Estatísticas de estudo podem ser adicionadas futuramente */}
            <div className="flex items-center space-x-1">
              <Trophy className="h-3 w-3" />
              <span>Estudante ativo</span>
            </div>
          </div>
          
          {/* Ações rápidas */}
          <div className="flex space-x-2">
            {onSendMessage && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onSendMessage(friend.id)}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Mensagem
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
