import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StudyGroup } from '@/hooks/useStudyGroups';
import {
    BookOpen,
    Filter,
    Plus,
    Search,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { GroupCard } from './GroupCard';

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            userRole={group.user_role}
            onViewGroup={onViewGroup}
            onManageGroup={onManageGroup}
            onInviteMembers={onInviteMembers}
            onLeaveGroup={onLeaveGroup}
            onJoinGroup={onJoinGroup}
          />
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
