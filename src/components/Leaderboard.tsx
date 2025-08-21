import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Medal, Search, Star, TrendingUp, Trophy, Zap } from 'lucide-react';
import React, { useMemo, useState } from 'react';

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  achievements: number;
  rank: number;
  category?: 'social' | 'study' | 'quiz' | 'group' | 'overall';
  change?: 'up' | 'down' | 'same';
  streak?: number;
  lastActive?: string;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserId?: string;
  showFilters?: boolean;
  showStats?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  category?: 'social' | 'study' | 'quiz' | 'group' | 'overall';
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <Star className="w-4 h-4 text-gray-400" />;
};

const getRankColor = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800';
  if (rank === 2) return 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-700';
  if (rank === 3) return 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800';
  return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
};

const getChangeIcon = (change?: 'up' | 'down' | 'same') => {
  switch (change) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case 'down':
      return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    default:
      return <div className="w-4 h-4" />;
  }
};

const getChangeColor = (change?: 'up' | 'down' | 'same') => {
  switch (change) {
    case 'up':
      return 'text-green-600 dark:text-green-400';
    case 'down':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-500 dark:text-gray-400';
  }
};

export const Leaderboard: React.FC<LeaderboardProps> = ({
  users,
  currentUserId,
  showFilters = true,
  showStats = true,
  variant = 'default',
  category = 'overall'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(category);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'overall') {
      filtered = filtered.filter(user => user.category === selectedCategory);
    }

    // Sort by points (descending)
    filtered.sort((a, b) => b.points - a.points);

    // Update ranks
    filtered.forEach((user, index) => {
      user.rank = index + 1;
    });

    return filtered;
  }, [users, searchTerm, selectedCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredUsers.length === 0) return null;

    const totalUsers = filteredUsers.length;
    const totalPoints = filteredUsers.reduce((sum, user) => sum + user.points, 0);
    const averagePoints = Math.round(totalPoints / totalUsers);
    const topUser = filteredUsers[0];
    const currentUserRank = currentUserId ? filteredUsers.find(u => u.id === currentUserId)?.rank : null;

    return {
      totalUsers,
      totalPoints,
      averagePoints,
      topUser,
      currentUserRank
    };
  }, [filteredUsers, currentUserId]);

  const handleUserClick = (user: LeaderboardUser) => {
    // Handle user click - could open profile or achievement details
    console.log('User clicked:', user);
  };

  if (variant === 'compact') {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Top 3</h3>
            </div>
            <Badge variant="secondary">
              {filteredUsers.length} usuários
            </Badge>
          </div>
          
          <div className="space-y-3">
            {filteredUsers.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getRankIcon(user.rank)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    #{user.rank}
                  </span>
                </div>
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                  {user.name}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user.points} XP
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      {showStats && stats && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">
                    Ranking de Usuários
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Compare seu progresso com outros usuários
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Participantes</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Top User Highlight */}
            {stats.topUser && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      🏆 {stats.topUser.name} - Líder do Ranking
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.topUser.points} XP • Nível {stats.topUser.level} • {stats.topUser.achievements} conquistas
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averagePoints}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">XP Médio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPoints}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.currentUserRank || 'N/A'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Sua Posição</div>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Buscar usuários..."
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
                <SelectItem value="overall">Geral</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="study">Estudo</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="group">Grupo</SelectItem>
              </SelectContent>
            </Select>

            {/* Timeframe Filter */}
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo Período</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
        </p>
        {filteredUsers.length === 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(category);
              setSelectedTimeframe('all');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Leaderboard */}
      {filteredUsers.length > 0 ? (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
                user.id === currentUserId ? 'ring-2 ring-blue-500' : ''
              } ${getRankColor(user.rank)}`}
              onClick={() => handleUserClick(user)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex items-center space-x-2 min-w-[60px]">
                    {getRankIcon(user.rank)}
                    <span className="font-bold text-gray-900 dark:text-white">
                      #{user.rank}
                    </span>
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex items-center space-x-3 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h4 className={`font-semibold truncate ${
                        user.id === currentUserId ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {user.name}
                        {user.id === currentUserId && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Você
                          </Badge>
                        )}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Nível {user.level}</span>
                        <span>{user.achievements} conquistas</span>
                        {user.streak && (
                          <span className="flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            {user.streak} dias
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Points and Change */}
                  <div className="flex items-center space-x-3 text-right">
                    <div className="flex items-center space-x-2">
                      {getChangeIcon(user.change)}
                      <span className={`text-sm ${getChangeColor(user.change)}`}>
                        {user.change === 'up' ? '+' : user.change === 'down' ? '-' : ''}
                      </span>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {user.points}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">XP</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum usuário encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Tente ajustar os filtros ou buscar por outro termo
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(category);
              setSelectedTimeframe('all');
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};
