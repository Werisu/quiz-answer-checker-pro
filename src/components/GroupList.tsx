import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StudyGroup } from '@/hooks/useStudyGroups';
import {
    BookOpen,
    Calendar,
    Crown,
    Filter,
    Plus,
    Search,
    Settings,
    Shield,
    User,
    Users
} from 'lucide-react';
import React, { useState } from 'react';

interface GroupListProps {
  groups: StudyGroup[];
  loading?: boolean;
  onCreateGroup: () => void;
  onJoinGroup: (groupId: string) => void;
  onViewGroup: (groupId: string) => void;
  onManageGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onInviteMembers: (groupId: string) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  loading = false,
  onCreateGroup,
  onJoinGroup,
  onViewGroup,
  onManageGroup,
  onLeaveGroup,
  onInviteMembers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'moderator' | 'member'>('all');

  // Filtrar grupos baseado nos filtros
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesVisibility = filterVisibility === 'all' || group.visibility === filterVisibility;
    const matchesRole = filterRole === 'all' || group.user_role === filterRole;
    
    return matchesSearch && matchesVisibility && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'member':
        return <User className="w-4 h-4 text-gray-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Admin</Badge>;
      case 'moderator':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Moderador</Badge>;
      case 'member':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">Membro</Badge>;
      default:
        return null;
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    return visibility === 'public' 
      ? <Badge variant="outline" className="text-green-600 border-green-600">Público</Badge>
      : <Badge variant="outline" className="text-orange-600 border-orange-600">Privado</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Nenhum grupo encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Você ainda não participa de nenhum grupo de estudo. Crie um novo grupo ou participe de grupos existentes!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onCreateGroup} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Grupo
            </Button>
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Explorar Grupos
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Meus Grupos de Estudo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredGroups.length} de {groups.length} grupos
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onCreateGroup} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Criar Grupo
          </Button>
        </div>
      </div>

      {/* Filtros e busca */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar grupos, descrições ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de visibilidade */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todas visibilidades</option>
              <option value="public">Públicos</option>
              <option value="private">Privados</option>
            </select>
          </div>

          {/* Filtro de role */}
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos os roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderador</option>
              <option value="member">Membro</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de grupos */}
      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Avatar do grupo */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Informações do grupo */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {group.name}
                        </h3>
                        {getVisibilityBadge(group.visibility)}
                        {getRoleBadge(group.user_role)}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {group.description}
                      </p>

                      {/* Tags */}
                      {group.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {group.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {group.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{group.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Estatísticas */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{group.member_count}/{group.max_members} membros</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Criado em {new Date(group.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {group.owner_name && (
                          <div className="flex items-center gap-1">
                            <Crown className="w-4 h-4" />
                            <span>Dono: {group.owner_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewGroup(group.id)}
                        className="flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Ver
                      </Button>
                      
                      {group.is_owner || group.user_role === 'admin' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onManageGroup(group.id)}
                          className="flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Gerenciar
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onInviteMembers(group.id)}
                          className="flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          Convidar
                        </Button>
                      )}
                      
                      {!group.is_owner && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onLeaveGroup(group.id)}
                          className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Sair
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensagem quando não há resultados nos filtros */}
      {filteredGroups.length === 0 && groups.length > 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Search className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum grupo encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar os filtros ou termos de busca.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
