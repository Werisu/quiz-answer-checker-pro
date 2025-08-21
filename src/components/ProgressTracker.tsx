import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, BookOpen, Star, Target, TrendingUp, Trophy, Users, Zap } from 'lucide-react';
import React from 'react';
import { Achievement } from './AchievementCard';

interface ProgressTrackerProps {
  achievements: Achievement[];
  showDetails?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

interface CategoryProgress {
  category: string;
  label: string;
  icon: React.ReactNode;
  total: number;
  unlocked: number;
  progress: number;
  points: number;
  color: string;
}

const categoryConfig = {
  social: {
    label: 'Social',
    icon: <Users className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-600'
  },
  study: {
    label: 'Estudo',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-600'
  },
  quiz: {
    label: 'Quiz',
    icon: <Target className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-600'
  },
  group: {
    label: 'Grupo',
    icon: <Users className="w-5 h-5" />,
    color: 'from-orange-500 to-red-600'
  },
  streak: {
    label: 'Sequência',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-red-500 to-pink-600'
  },
  special: {
    label: 'Especial',
    icon: <Award className="w-5 h-5" />,
    color: 'from-pink-500 to-purple-600'
  }
};

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  achievements,
  showDetails = true,
  variant = 'default'
}) => {
  // Calculate overall progress
  const overallStats = React.useMemo(() => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.unlocked).length;
    const locked = total - unlocked;
    const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
    const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    return { total, unlocked, locked, totalPoints, progress };
  }, [achievements]);

  // Calculate progress by category
  const categoryProgress = React.useMemo(() => {
    const progress: CategoryProgress[] = [];

    Object.entries(categoryConfig).forEach(([key, config]) => {
      const categoryAchievements = achievements.filter(a => a.category === key);
      const total = categoryAchievements.length;
      const unlocked = categoryAchievements.filter(a => a.unlocked).length;
      const progressPercent = total > 0 ? Math.round((unlocked / total) * 100) : 0;
      const points = categoryAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

      progress.push({
        category: key,
        label: config.label,
        icon: config.icon,
        total,
        unlocked,
        progress: progressPercent,
        points,
        color: config.color
      });
    });

    // Sort by progress percentage (descending)
    return progress.sort((a, b) => b.progress - a.progress);
  }, [achievements]);

  // Calculate level based on total points
  const calculateLevel = (points: number) => {
    if (points < 100) return { level: 1, progress: points, nextLevel: 100 };
    if (points < 250) return { level: 2, progress: points - 100, nextLevel: 250 };
    if (points < 500) return { level: 3, progress: points - 250, nextLevel: 500 };
    if (points < 1000) return { level: 4, progress: points - 500, nextLevel: 1000 };
    if (points < 2000) return { level: 5, progress: points - 1000, nextLevel: 2000 };
    return { level: 6, progress: points - 2000, nextLevel: 3000 };
  };

  const levelInfo = calculateLevel(overallStats.totalPoints);
  const levelProgress = Math.min((levelInfo.progress / (levelInfo.nextLevel - (levelInfo.nextLevel - levelInfo.progress))) * 100, 100);

  if (variant === 'compact') {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Nível {levelInfo.level}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {overallStats.totalPoints} XP
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallStats.progress}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Geral</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Progresso Geral
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Acompanhe seu desenvolvimento e desbloqueie novas conquistas
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {overallStats.totalPoints}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total de XP</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Nível {levelInfo.level} • {levelInfo.progress}/{levelInfo.nextLevel - levelInfo.progress} XP para o próximo nível
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round(levelProgress)}%
              </span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>

          {/* Overall Achievement Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Conquistas Desbloqueadas</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {overallStats.unlocked}/{overallStats.total} ({overallStats.progress}%)
              </span>
            </div>
            <Progress value={overallStats.progress} className="h-3" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallStats.unlocked}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Desbloqueadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallStats.locked}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Bloqueadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {levelInfo.level}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Nível</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Progress */}
      {showDetails && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Progresso por Categoria
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryProgress.map((category) => (
              <Card key={category.category} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${category.color} text-white`}>
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-sm text-gray-900 dark:text-white">
                          {category.label}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
                          {category.unlocked}/{category.total} conquistas
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.points} XP
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {category.progress}%
                    </span>
                  </div>
                  <Progress value={category.progress} className="h-2" />
                  
                  {category.progress === 100 && (
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <Star className="w-4 h-4" />
                      <span className="text-xs font-medium">Categoria Completa!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Achievements */}
      {showDetails && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conquistas Recentes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements
              .filter(a => a.unlocked && a.unlockedAt)
              .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
              .slice(0, 3)
              .map((achievement) => (
                <Card key={achievement.id} className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.points} XP • {new Date(achievement.unlockedAt!).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
