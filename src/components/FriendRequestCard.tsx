import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { FriendRequest } from '@/integrations/supabase/social-types';
import { Check, Clock, UserPlus, X } from 'lucide-react';
import React from 'react';

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onViewProfile?: (userId: string) => void;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onAccept,
  onReject,
  onViewProfile
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getInitials(request.requester_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{request.requester_name}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(request.created_at)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Solicitação de amizade
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {request.requester_name} quer ser seu amigo no sistema de estudos.
          </div>
          
          <div className="flex space-x-2">
            {onViewProfile && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewProfile(request.requester_id)}
              >
                Ver perfil
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onReject(request.id)}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-3 w-3 mr-1" />
              Rejeitar
            </Button>
            
            <Button 
              size="sm"
              onClick={() => onAccept(request.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-3 w-3 mr-1" />
              Aceitar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
