import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, BookOpen, Filter, Search, Target, Trophy, Users, Zap } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Achievement, AchievementCard } from './AchievementCard';

interface AchievementListProps {
  achievements: Achievement[];
  onAchievementClick?: (achievement: Achievement) => void;
  showFilters?: boolean;
  showStats?: boolean;
  variant?: 'grid' | 'list' | 'compact';
}

const categoryIcons = {
  social: <Users className="w-4 h-4" />,
  study: <BookOpen className="w-4 h-4" />,
  quiz: <Target className="w-4 h-4" />,
  group: <Users className="w-4 h-4" />,
  streak: <Zap className="w-4 h-4" />,
  special: <Award className="w-4 h-4" />
};

const categoryLabels = {
  social: 'Social',
  study: 'Estudo',
  quiz: 'Quiz',
  group: 'Grupo',
  streak: 'Sequência',
  special: 'Especial'
};

export const AchievementList: React.FC<AchievementListProps> = ({
  achievements,
  onAchievementClick,
  showFilters = true,
  showStats = true,
  variant = 'grid'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter achievements based on search and filters
  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
      const matchesRarity = selectedRarity === 'all' || achievement.rarity === selectedRarity;
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'unlocked' && achievement.unlocked) ||
                           (selectedStatus === 'locked' && !achievement.unlocked);

      return matchesSearch && matchesCategory && matchesRarity && matchesStatus;
    });
  }, [achievements, searchTerm, selectedCategory, selectedRarity, selectedStatus]);

  // Group achievements by category
  const achievementsByCategory = useMemo(() => {
    const grouped = filteredAchievements.reduce((acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    }, {} as Record<string, Achievement[]>);

    return grouped;
  }, [filteredAchievements]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.unlocked).length;
    const locked = total - unlocked;
    const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
    const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    return { total, unlocked, locked, totalPoints, progress };
  }, [achievements]);

  const handleAchievementClick = (achievement: Achievement) => {
    if (onAchievementClick) {
      onAchievementClick(achievement);
    }
  };

  const renderAchievementGrid = (achievements: Achievement[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <div key={achievement.id} onClick={() => handleAchievementClick(achievement)}>
          <AchievementCard 
            achievement={achievement} 
            variant={variant === 'compact' ? 'compact' : 'default'}
            showProgress={true}
          />
        </div>
      ))}
    </div>
  );

  const renderAchievementList = (achievements: Achievement[]) => (
    <div className="space-y-3">
      {achievements.map((achievement) => (
        <div key={achievement.id} onClick={() => handleAchievementClick(achievement)}>
          <AchievementCard 
            achievement={achievement} 
            variant="compact"
            showProgress={true}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      {showStats && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Conquistas
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Desbloqueie conquistas e ganhe pontos de experiência
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalPoints}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total de XP</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progresso Geral</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.unlocked}/{stats.total} ({stats.progress}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar conquistas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center space-x-2">
                      {categoryIcons[key as keyof typeof categoryIcons]}
                      <span>{label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Rarity Filter */}
            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Raridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Raridades</SelectItem>
                <SelectItem value="common">Comum</SelectItem>
                <SelectItem value="rare">Rara</SelectItem>
                <SelectItem value="epic">Épica</SelectItem>
                <SelectItem value="legendary">Lendária</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="unlocked">Desbloqueadas</SelectItem>
                <SelectItem value="locked">Bloqueadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'all' || selectedRarity !== 'all' || selectedStatus !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Filtros ativos:</span>
                {selectedCategory !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    {categoryLabels[selectedCategory as keyof typeof categoryLabels]}
                  </Badge>
                )}
                {selectedRarity !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    {selectedRarity.charAt(0).toUpperCase() + selectedRarity.slice(1)}
                  </Badge>
                )}
                {selectedStatus !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    {selectedStatus === 'unlocked' ? 'Desbloqueadas' : 'Bloqueadas'}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedRarity('all');
                    setSelectedStatus('all');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Limpar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredAchievements.length} conquista{filteredAchievements.length !== 1 ? 's' : ''} encontrada{filteredAchievements.length !== 1 ? 's' : ''}
        </p>
        {filteredAchievements.length === 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedRarity('all');
              setSelectedStatus('all');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Achievements Display */}
      {filteredAchievements.length > 0 ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7">
            <TabsTrigger value="all">Todas</TabsTrigger>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <TabsTrigger key={key} value={key} className="hidden lg:flex">
                {categoryIcons[key as keyof typeof categoryIcons]}
                <span className="ml-1 hidden xl:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {variant === 'list' ? renderAchievementList(filteredAchievements) : renderAchievementGrid(filteredAchievements)}
          </TabsContent>

          {Object.keys(categoryLabels).map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              {achievementsByCategory[category] ? (
                variant === 'list' ? 
                  renderAchievementList(achievementsByCategory[category]) : 
                  renderAchievementGrid(achievementsByCategory[category])
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Nenhuma conquista encontrada nesta categoria
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma conquista encontrada
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Tente ajustar os filtros ou buscar por outro termo
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedRarity('all');
              setSelectedStatus('all');
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};
