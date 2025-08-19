import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useFriends } from '@/hooks/useFriends';
import type { UserSearchResult } from '@/integrations/supabase/social-types';
import { AlertCircle, CheckCircle, Search, UserPlus, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AddFriendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = ({
  open,
  onOpenChange,
  trigger
}) => {
  const { searchUsers, sendFriendRequest, areFriends, getFriendshipStatus } = useFriends();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Buscar usuários quando a query mudar
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        await performSearch();
      } else if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        setSearchPerformed(false);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const results = await searchUsers(searchQuery.trim());
      setSearchResults(results);
      setSearchPerformed(true);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao buscar usuários. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (user: UserSearchResult) => {
    setSelectedUser(user);
    
    // Verificar status da amizade
    try {
      const areAlreadyFriends = await areFriends(user.id);
      if (areAlreadyFriends) {
        setFriendshipStatus('friends');
      } else {
        const status = await getFriendshipStatus(user.id);
        setFriendshipStatus(status);
      }
    } catch (error) {
      console.error('Erro ao verificar status da amizade:', error);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedUser) return;
    
    setSendingRequest(true);
    setMessage(null);
    
    try {
      const success = await sendFriendRequest(selectedUser.id);
      if (success) {
        setMessage({
          type: 'success',
          text: `Solicitação enviada para ${selectedUser.name}!`
        });
        setFriendshipStatus('pending_sent');
        // Limpar seleção após alguns segundos
        setTimeout(() => {
          setSelectedUser(null);
          setFriendshipStatus(null);
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: 'Erro ao enviar solicitação. Tente novamente.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao enviar solicitação. Tente novamente.'
      });
    } finally {
      setSendingRequest(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'friends':
        return <Badge variant="default" className="bg-green-600">Já são amigos</Badge>;
      case 'pending_sent':
        return <Badge variant="secondary">Solicitação enviada</Badge>;
      case 'pending_received':
        return <Badge variant="outline">Solicitação recebida</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Usuário bloqueado</Badge>;
      default:
        return <Badge variant="outline">Não são amigos</Badge>;
    }
  };

  const canSendRequest = (status: string | null) => {
    return !status || (status !== 'friends' && status !== 'pending_sent' && status !== 'blocked');
  };

  const resetModal = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchPerformed(false);
    setSelectedUser(null);
    setFriendshipStatus(null);
    setMessage(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetModal();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Amigo
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-1 lg:space-x-2">
            <UserPlus className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-base lg:text-lg">Adicionar Novo Amigo</span>
          </DialogTitle>
          <DialogDescription className="text-xs lg:text-sm">
            Busque por usuários e envie solicitações de amizade para expandir sua rede de estudos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barra de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite o nome ou email do usuário..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Mensagens de feedback */}
          {message && (
            <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Resultados da busca */}
          {searchPerformed && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Resultados da busca ({searchResults.length})
              </h3>
              
              {loading ? (
                // Skeleton loading
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-3">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <Card className="p-8 text-center">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente buscar com um nome ou email diferente.
                  </p>
                </Card>
              ) : (
                // Lista de usuários encontrados
                <div className="space-y-3">
                  {searchResults.map((user) => (
                    <Card 
                      key={user.id} 
                      className={`p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedUser?.id === user.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {selectedUser?.id === user.id && friendshipStatus && (
                            getStatusBadge(friendshipStatus)
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Usuário selecionado */}
          {selectedUser && (
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Usuário Selecionado</CardTitle>
                <CardDescription>
                  {selectedUser.name} - {selectedUser.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(selectedUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{selectedUser.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                      {friendshipStatus && getStatusBadge(friendshipStatus)}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {canSendRequest(friendshipStatus) && (
                  <Button
                    onClick={handleSendRequest}
                    disabled={sendingRequest}
                    className="w-full"
                  >
                    {sendingRequest ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Enviar Solicitação de Amizade
                      </>
                    )}
                  </Button>
                )}
                
                {friendshipStatus === 'friends' && (
                  <div className="text-center text-sm text-muted-foreground">
                    Vocês já são amigos! 🎉
                  </div>
                )}
                
                {friendshipStatus === 'pending_sent' && (
                  <div className="text-center text-sm text-muted-foreground">
                    Solicitação já enviada. Aguardando resposta...
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instruções */}
          {!searchPerformed && (
            <Card className="p-6 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Busque por usuários</h3>
              <p className="text-muted-foreground">
                Digite o nome ou email de um usuário para começar a buscar.
                Você precisa digitar pelo menos 2 caracteres.
              </p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
