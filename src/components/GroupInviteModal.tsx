import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudyGroup } from '@/hooks/useStudyGroups';
import { AlertCircle, Check, Loader2, Mail, Search, User, UserPlus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface UserSearchResult {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface GroupInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: StudyGroup;
  onInviteUser: (groupId: string, userId: string) => Promise<boolean>;
  loading?: boolean;
}

export const GroupInviteModal: React.FC<GroupInviteModalProps> = ({
  isOpen,
  onClose,
  group,
  onInviteUser,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [invitingUsers, setInvitingUsers] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mock de busca de usuários (será substituído por API real)
  const mockSearchUsers = async (query: string): Promise<UserSearchResult[]> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!query.trim()) return [];
    
    // Mock de usuários (em produção, isso viria da API)
    const mockUsers: UserSearchResult[] = [
      {
        id: 'user-1',
        email: 'joao@exemplo.com',
        name: 'João Silva',
        avatar_url: undefined
      },
      {
        id: 'user-2',
        email: 'maria@exemplo.com',
        name: 'Maria Santos',
        avatar_url: undefined
      },
      {
        id: 'user-3',
        email: 'pedro@exemplo.com',
        name: 'Pedro Oliveira',
        avatar_url: undefined
      },
      {
        id: 'user-4',
        email: 'ana@exemplo.com',
        name: 'Ana Costa',
        avatar_url: undefined
      }
    ];
    
    // Filtrar por nome ou email
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      
      const results = await mockSearchUsers(searchTerm);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('Nenhum usuário encontrado com esses termos de busca.');
      }
    } catch (err) {
      setError('Erro ao buscar usuários. Tente novamente.');
      console.error('Erro na busca:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleInviteUser = async (userId: string) => {
    try {
      setInvitingUsers(prev => new Set(prev).add(userId));
      setError(null);
      
      const success = await onInviteUser(group.id, userId);
      
      if (success) {
        setSuccessMessage('Convite enviado com sucesso!');
        // Remover usuário da lista de resultados
        setSearchResults(prev => prev.filter(user => user.id !== userId));
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Erro ao enviar convite. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao enviar convite. Tente novamente.');
      console.error('Erro ao convidar usuário:', err);
    } finally {
      setInvitingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
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

  const isInviting = (userId: string) => invitingUsers.has(userId);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSearchResults([]);
      setError(null);
      setSuccessMessage(null);
      setInvitingUsers(new Set());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white dark:bg-gray-900 border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    Convidar Usuários
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Convide usuários para o grupo "{group.name}"
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informações do Grupo */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    {group.name}
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {group.member_count}/{group.max_members} membros • {group.visibility === 'public' ? 'Público' : 'Privado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Busca de Usuários */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Buscar Usuários
              </Label>
              
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim() || searching}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {searching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span className="ml-2">Buscar</span>
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Digite o nome ou email do usuário que deseja convidar
              </p>
            </div>

            {/* Mensagens de Status */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
              </div>
            )}

            {/* Resultados da Busca */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usuários Encontrados ({searchResults.length})
                </Label>
                
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar_url} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm font-medium">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleInviteUser(user.id)}
                        disabled={isInviting(user.id) || loading}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isInviting(user.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                        <span className="ml-2">
                          {isInviting(user.id) ? 'Convidando...' : 'Convidar'}
                        </span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estado Vazio */}
            {searchTerm && !searching && searchResults.length === 0 && !error && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Tente buscar com outros termos ou verifique se o usuário existe no sistema.
                </p>
              </div>
            )}

            {/* Dicas de Uso */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                💡 Dicas para convites
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Busque por nome completo ou email do usuário</li>
                <li>• Usuários já membros do grupo não aparecerão</li>
                <li>• Convites pendentes serão mostrados como "já convidado"</li>
                <li>• Apenas admins e moderadores podem convidar usuários</li>
              </ul>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
