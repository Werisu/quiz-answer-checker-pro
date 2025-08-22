import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Friend } from '@/hooks/useFriends';
import type { StudyGroup } from '@/hooks/useStudyGroups';
import { Search, UserPlus, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (type: 'private' | 'group', targetId: string, name?: string) => Promise<void>;
  friends: Friend[];
  groups: StudyGroup[];
  loading?: boolean;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onStartChat,
  friends,
  groups,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState<'private' | 'group'>('private');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [chatName, setChatName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedFriend(null);
      setSelectedGroup(null);
      setChatName('');
    }
  }, [isOpen]);

  const handleStartPrivateChat = async () => {
    if (selectedFriend) {
      await onStartChat('private', selectedFriend.id);
      onClose();
    }
  };

  const handleStartGroupChat = async () => {
    if (selectedGroup && chatName.trim()) {
      await onStartChat('group', selectedGroup.id, chatName.trim());
      onClose();
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">Nova Conversa</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'private' | 'group')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="private" className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Privado</span>
              </TabsTrigger>
              <TabsTrigger value="group" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Grupo</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="private" className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="friend-search">Buscar amigo</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="friend-search"
                    placeholder="Digite o nome do amigo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      onClick={() => setSelectedFriend(friend)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedFriend?.id === friend.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                            {friend.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{friend.name}</span>
                      </div>
                    </div>
                  ))}
                  
                  {filteredFriends.length === 0 && searchQuery && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      Nenhum amigo encontrado
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleStartPrivateChat}
                  disabled={!selectedFriend || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Iniciando...' : 'Iniciar Chat Privado'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="group" className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="group-search">Buscar grupo</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="group-search"
                    placeholder="Digite o nome do grupo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedGroup?.id === group.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-xs">
                            <Users className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{group.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {group.visibility}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {group.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredGroups.length === 0 && searchQuery && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      Nenhum grupo encontrado
                    </p>
                  )}
                </div>

                {selectedGroup && (
                  <div className="space-y-2">
                    <Label htmlFor="chat-name">Nome do chat</Label>
                    <Input
                      id="chat-name"
                      placeholder="Digite o nome do chat..."
                      value={chatName}
                      onChange={(e) => setChatName(e.target.value)}
                    />
                  </div>
                )}

                <Button
                  onClick={handleStartGroupChat}
                  disabled={!selectedGroup || !chatName.trim() || loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Criando...' : 'Criar Chat de Grupo'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
