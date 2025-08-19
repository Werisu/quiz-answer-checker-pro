import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFriends } from '@/hooks/useFriends';
import {
    ArrowRight,
    Bell,
    Circle,
    MessageCircle,
    MoreHorizontal,
    Plus,
    UserPlus,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { AddFriendModal } from './AddFriendModal';

interface SocialWidgetProps {
  className?: string;
  onViewAllFriends?: () => void;
  onSendMessage?: (friendId: string) => void;
  onViewProfile?: (userId: string) => void;
  onViewRequests?: () => void;
}

export const SocialWidget: React.FC<SocialWidgetProps> = ({
  className = '',
  onViewAllFriends,
  onSendMessage,
  onViewProfile,
  onViewRequests
}) => {
  const { friends, pendingRequests } = useFriends();
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);

  // Filtrar amigos online (máximo 5 para o widget)
  const onlineFriends = friends.filter(friend => friend.is_online).slice(0, 5);
  const totalOnline = friends.filter(friend => friend.is_online).length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 lg:space-x-2">
            <Users className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
            <CardTitle className="text-base lg:text-lg">Social</CardTitle>
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-1 lg:ml-2 text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1 lg:space-x-2">
            <AddFriendModal
              open={addFriendModalOpen}
              onOpenChange={setAddFriendModalOpen}
              trigger={
                <Button size="sm" variant="outline" className="h-7 w-7 lg:h-8 lg:w-8 p-0">
                  <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
                </Button>
              }
            />
            
            <Button size="sm" variant="ghost" className="h-7 w-7 lg:h-8 lg:w-8 p-0">
              <MoreHorizontal className="h-3 w-3 lg:h-4 lg:w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs lg:text-sm">
          {totalOnline} amigos online • {pendingRequests.length} solicitações pendentes
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estatísticas Rápidas - Responsivas */}
        <div className="grid grid-cols-3 gap-2 lg:gap-3">
          <div className="text-center p-2 lg:p-3 bg-muted/50 rounded-lg">
            <div className="text-lg lg:text-2xl font-bold text-primary">{friends.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-2 lg:p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-lg lg:text-2xl font-bold text-green-600">{totalOnline}</div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{pendingRequests.length}</div>
            <div className="text-xs text-muted-foreground">Pendentes</div>
          </div>
        </div>

        {/* Amigos Online */}
        {onlineFriends.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center space-x-2">
                <Circle className="h-3 w-3 text-green-500 fill-current" />
                <span>Amigos Online</span>
              </h4>
              {onViewAllFriends && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={onViewAllFriends}
                >
                  Ver todos
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-20">
              <div className="space-y-2">
                {onlineFriends.map(friend => (
                  <div
                    key={friend.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(friend.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white ${getStatusColor(friend.is_online || false)}`} />
                    </div>
                    
                    <span className="text-sm font-medium truncate flex-1">
                      {friend.name}
                    </span>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onSendMessage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => onSendMessage(friend.id)}
                        >
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {onViewProfile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => onViewProfile(friend.id)}
                        >
                          <Users className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Solicitações Pendentes */}
        {pendingRequests.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center space-x-2">
                <Bell className="h-3 w-3 text-orange-500" />
                <span>Solicitações Pendentes</span>
              </h4>
              {onViewRequests && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={onViewRequests}
                >
                  Ver todas
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {pendingRequests.slice(0, 3).map(request => (
                <div
                  key={request.id}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20"
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
                <div className="text-center">
                  <Button variant="outline" size="sm" className="w-full">
                    +{pendingRequests.length - 3} mais solicitações
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado Vazio */}
        {onlineFriends.length === 0 && pendingRequests.length === 0 && (
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h4 className="text-sm font-medium mb-1">Nenhuma atividade social</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Adicione amigos para começar a interagir
            </p>
            <Button 
              size="sm" 
              onClick={() => setAddFriendModalOpen(true)}
            >
              <UserPlus className="h-3 w-3 mr-1" />
              Adicionar Amigo
            </Button>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="pt-2 border-t border-border">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setAddFriendModalOpen(true)}
            >
              <UserPlus className="h-3 w-3 mr-1" />
              Adicionar
            </Button>
            
            {onViewAllFriends && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={onViewAllFriends}
              >
                <Users className="h-3 w-3 mr-1" />
                Ver Todos
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
