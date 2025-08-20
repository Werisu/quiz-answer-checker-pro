import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StudyGroup } from '@/hooks/useStudyGroups';
import {
    BookOpen,
    Calendar,
    Eye,
    EyeOff,
    Filter,
    Loader2,
    Search,
    Tag,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ExploreGroupsProps {
  onJoinGroup: (groupId: string) => Promise<boolean>;
  onViewGroup: (groupId: string) => void;
  loading?: boolean;
}

interface PublicGroup extends StudyGroup {
  is_member?: boolean;
  member_count: number;
  max_members: number;
  created_at: string;
  tags: string[];
}

export const ExploreGroups: React.FC<ExploreGroupsProps> = ({
  onJoinGroup,
  onViewGroup,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'popular' | 'recent' | 'available'>('all');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [groups, setGroups] = useState<PublicGroup[]>([]);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [joiningGroups, setJoiningGroups] = useState<Set<string>>(new Set());

  // Mock de grupos públicos (será substituído por API real)
  const mockPublicGroups: PublicGroup[] = [
    {
      id: 'group-1',
      name: 'Matemática Avançada',
      description: 'Grupo para estudantes de matemática avançada, incluindo cálculo, álgebra linear e análise matemática.',
      visibility: 'public',
      max_members: 50,
      member_count: 32,
      created_at: '2024-01-15T10:00:00Z',
      tags: ['matemática', 'cálculo', 'álgebra', 'avançado'],
      owner_id: 'owner-1',
      tags: ['matemática', 'cálculo', 'álgebra', 'avançado']
    },
    {
      id: 'group-2',
      name: 'Programação Web',
      description: 'Aprenda desenvolvimento web moderno com React, Node.js e TypeScript.',
      visibility: 'public',
      max_members: 30,
      member_count: 28,
      created_at: '2024-02-01T14:30:00Z',
      tags: ['programação', 'web', 'react', 'nodejs'],
      owner_id: 'owner-2',
      tags: ['programação', 'web', 'react', 'nodejs']
    },
    {
      id: 'group-3',
      name: 'História da Arte',
      description: 'Explorando os movimentos artísticos desde a Renascença até a arte contemporânea.',
      visibility: 'public',
      max_members: 40,
      member_count: 15,
      created_at: '2024-01-20T09:15:00Z',
      tags: ['arte', 'história', 'renascença', 'contemporâneo'],
      owner_id: 'owner-3',
      tags: ['arte', 'história', 'renascença', 'contemporâneo']
    },
    {
      id: 'group-4',
      name: 'Física Quântica',
      description: 'Discussões sobre mecânica quântica, teoria das cordas e física moderna.',
      visibility: 'public',
      max_members: 25,
      member_count: 25,
      created_at: '2024-02-10T16:45:00Z',
      tags: ['física', 'quântica', 'teoria das cordas', 'moderna'],
      owner_id: 'owner-4',
      tags: ['física', 'quântica', 'teoria das cordas', 'moderna']
    },
    {
      id: 'group-5',
      name: 'Literatura Clássica',
      description: 'Análise e discussão das obras-primas da literatura mundial.',
      visibility: 'public',
      max_members: 35,
      member_count: 22,
      created_at: '2024-01-25T11:20:00Z',
      tags: ['literatura', 'clássica', 'análise', 'discussão'],
      owner_id: 'owner-5',
      tags: ['literatura', 'clássica', 'análise', 'discussão']
    }
  ];

  // Simular busca de grupos públicos
  const fetchPublicGroups = async () => {
    setExploreLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      setGroups(mockPublicGroups);
    } catch (error) {
      console.error('Erro ao buscar grupos públicos:', error);
    } finally {
      setExploreLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicGroups();
  }, []);

  // Filtrar grupos baseado nos filtros
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || 
                           (filterCategory === 'popular' && group.member_count >= group.max_members * 0.8) ||
                           (filterCategory === 'recent' && new Date(group.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                           (filterCategory === 'available' && group.member_count < group.max_members);
    
    const matchesTags = filterTags.length === 0 || 
                       filterTags.some(tag => group.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  // Todas as tags disponíveis
  const allTags = Array.from(new Set(groups.flatMap(group => group.tags)));

  const handleJoinGroup = async (groupId: string) => {
    try {
      setJoiningGroups(prev => new Set(prev).add(groupId));
      const success = await onJoinGroup(groupId);
      
      if (success) {
        // Atualizar o grupo localmente
        setGroups(prev => prev.map(group => 
          group.id === groupId 
            ? { ...group, member_count: group.member_count + 1, is_member: true }
            : group
        ));
      }
    } catch (error) {
      console.error('Erro ao entrar no grupo:', error);
    } finally {
      setJoiningGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
    }
  };

  const toggleTagFilter = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterTags([]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'popular':
        return <TrendingUp className="w-4 h-4" />;
      case 'recent':
        return <Calendar className="w-4 h-4" />;
      case 'available':
        return <Users className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'popular':
        return 'Populares';
      case 'recent':
        return 'Recentes';
      case 'available':
        return 'Com Vagas';
      default:
        return 'Todos';
    }
  };

  const getMemberCountColor = (group: PublicGroup) => {
    const percentage = (group.member_count / group.max_members) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  const getMemberCountBg = (group: PublicGroup) => {
    const percentage = (group.member_count / group.max_members) * 100;
    if (percentage >= 90) return 'bg-red-100 dark:bg-red-900/20';
    if (percentage >= 75) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-green-100 dark:bg-green-900/20';
  };

  if (loading || exploreLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Explorando grupos públicos...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Carregando grupos disponíveis para você
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Explorar Grupos Públicos
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Descubra e participe de grupos de estudo incríveis
        </p>
      </div>

      {/* Filtros e Busca */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar grupos por nome, descrição ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg py-3"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            {/* Filtro de Categoria */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria:</span>
              <div className="flex space-x-1">
                {(['all', 'popular', 'recent', 'available'] as const).map((category) => (
                  <Button
                    key={category}
                    variant={filterCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory(category)}
                    className="flex items-center space-x-1"
                  >
                    {getCategoryIcon(category)}
                    <span>{getCategoryLabel(category)}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Filtro de Tags */}
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {allTags.slice(0, 8).map((tag) => (
                  <Button
                    key={tag}
                    variant={filterTags.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTagFilter(tag)}
                    className="text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Limpar Filtros */}
            {(searchTerm || filterCategory !== 'all' || filterTags.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">{groups.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total de Grupos</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">
            {groups.filter(g => g.member_count < g.max_members).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Com Vagas</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-600">
            {groups.filter(g => g.member_count >= g.max_members * 0.8).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Populares</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-600">
            {groups.filter(g => new Date(g.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Recentes</div>
        </Card>
      </div>

      {/* Lista de Grupos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="group hover:shadow-lg transition-all duration-200 border-0 bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {group.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {group.description}
                    </CardDescription>
                  </div>
                </div>
                
                {/* Badge de Status */}
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={`flex items-center space-x-1 ${getMemberCountBg(group)}`}
                  >
                    {group.visibility === 'public' ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-orange-600" />
                    )}
                    <span className="text-xs">
                      {group.visibility === 'public' ? 'Público' : 'Privado'}
                    </span>
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Informações do Grupo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div className="text-sm">
                    <span className={`font-medium ${getMemberCountColor(group)}`}>
                      {group.member_count}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /{group.max_members} membros
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(group.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {group.tags && group.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <div className="flex flex-wrap gap-1">
                    {group.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {group.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        +{group.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Barra de Progresso de Membros */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Capacidade do grupo</span>
                  <span>{Math.round((group.member_count / group.max_members) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      (group.member_count / group.max_members) >= 0.9
                        ? 'bg-red-500'
                        : (group.member_count / group.max_members) >= 0.75
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min((group.member_count / group.max_members) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewGroup(group.id)}
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Ver Detalhes</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={group.member_count >= group.max_members || joiningGroups.has(group.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {joiningGroups.has(group.id) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  <span className="ml-2">
                    {group.member_count >= group.max_members ? 'Grupo Cheio' : 'Entrar'}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado Vazio */}
      {filteredGroups.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum grupo encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterCategory !== 'all' || filterTags.length > 0
                ? 'Tente ajustar os filtros ou termos de busca.'
                : 'Não há grupos públicos disponíveis no momento.'
              }
            </p>
            {(searchTerm || filterCategory !== 'all' || filterTags.length > 0) && (
              <Button onClick={clearFilters} variant="outline">
                Limpar Filtros
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
