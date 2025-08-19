import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFriends } from '@/hooks/useFriends';
import {
    AlertCircle,
    CheckCircle,
    Plus,
    RefreshCw,
    Search,
    UserCheck,
    UserPlus,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { AddFriendModal } from './AddFriendModal';
import { FriendCard } from './FriendCard';
import { FriendRequestCard } from './FriendRequestCard';

interface FriendsListProps {
  onSendMessage?: (friendId: string) => void;
  onViewProfile?: (userId: string) => void;
  onAddFriend?: () => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({
  onSendMessage,
  onViewProfile,
  onAddFriend
}) => {
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const {
    friends,
    pendingRequests,
    loading,
    error,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    blockUser,
    refreshData,
    clearError
  } = useFriends();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('friends');

  // Filtrar amigos por busca
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtrar solicitações por busca
  const filteredRequests = pendingRequests.filter(request =>
    request.requester_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAcceptRequest = async (requestId: string) => {
    const success = await acceptFriendRequest(requestId);
    if (success) {
      // Feedback visual pode ser adicionado aqui
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const success = await rejectFriendRequest(requestId);
    if (success) {
      // Feedback visual pode ser adicionado aqui
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    const success = await removeFriend(friendId);
    if (success) {
      // Feedback visual pode ser adicionado aqui
    }
  };

  const handleBlockUser = async (userId: string) => {
    const success = await blockUser(userId);
    if (success) {
      // Feedback visual pode ser adicionado aqui
    }
  };

  const renderFriendsList = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredFriends.length === 0) {
      return (
        <Card className="p-8 text-center">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum amigo encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Nenhum amigo corresponde à sua busca.' : 'Você ainda não tem amigos adicionados.'}
          </p>
          {!searchQuery && onAddFriend && (
            <Button onClick={onAddFriend}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar amigos
            </Button>
          )}
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {filteredFriends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onRemoveFriend={handleRemoveFriend}
            onBlockUser={handleBlockUser}
            onSendMessage={onSendMessage}
            onViewProfile={onViewProfile}
          />
        ))}
      </div>
    );
  };

  const renderRequestsList = () => {
    if (filteredRequests.length === 0) {
      return (
        <Card className="p-8 text-center">
          <UserCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação pendente</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Nenhuma solicitação corresponde à sua busca.' : 'Você não tem solicitações de amizade pendentes.'}
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <FriendRequestCard
            key={request.id}
            request={request}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            onViewProfile={onViewProfile}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Amigos</h1>
          <p className="text-muted-foreground">
            Gerencie suas conexões e solicitações de amizade
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <AddFriendModal
            open={addFriendModalOpen}
            onOpenChange={setAddFriendModalOpen}
            trigger={
              <Button onClick={() => setAddFriendModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar amigo
              </Button>
            }
          />
        </div>
      </div>

      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar amigos ou solicitações..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Mensagem de erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2 text-destructive"
              onClick={clearError}
            >
              Fechar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Amigos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{friends.length}</div>
            <p className="text-xs text-muted-foreground">
              {friends.filter(f => f.is_online).length} online
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando resposta
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Sincronizado</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="friends" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Meus Amigos</span>
            {friends.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {friends.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="requests" className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Solicitações</span>
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-6">
          {renderFriendsList()}
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          {renderRequestsList()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
