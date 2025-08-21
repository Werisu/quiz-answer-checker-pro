import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AchievementProgress } from '@/hooks/useAchievements';
import { Book, Star, Target, Trophy, Users, Zap } from 'lucide-react';
import React from 'react';

interface AchievementStatsProps {
  progress: AchievementProgress;
  className?: string;
}

const categoryIcons = {
  social: Users,
  study: Book,
  quiz: Target,
  group: Users,
  streak: Zap,
  special: Star
};

const categoryColors = {
  social: 'from-blue-500 to-blue-600',
  study: 'from-green-500 to-green-600',
  quiz: 'from-purple-500 to-purple-600',
  group: 'from-orange-500 to-orange-600',
  streak: 'from-yellow-500 to-yellow-600',
  special: 'from-pink-500 to-pink-600'
};

export const AchievementStats: React.FC<AchievementStatsProps> = ({
  progress,
  className = ''
}) => {
  const nextLevelPoints = progress.level * 100;
  const progressToNextLevel = progress.totalPoints % 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nível */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{progress.level}</div>
                <div className="text-xs opacity-90">Nível</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pontos */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{progress.totalPoints}</div>
                <div className="text-xs opacity-90">Pontos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conquistas Desbloqueadas */}
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{progress.achievementsUnlocked}</div>
                <div className="text-xs opacity-90">Conquistas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total de Conquistas */}
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{progress.totalAchievements}</div>
                <div className="text-xs opacity-90">Disponíveis</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso para o Próximo Nível */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-purple-600" />
            <span>Progresso para o Nível {progress.level + 1}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {progress.totalPoints} / {nextLevelPoints} pontos
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {progressToNextLevel} pontos restantes
              </span>
            </div>
            <Progress value={(progressToNextLevel / 100) * 100} className="h-3" />
            <div className="text-center text-sm text-gray-500">
              {progressToNextLevel} pontos para o próximo nível
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progresso por Categoria */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Progresso por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(progress.categoryProgress).map(([category, unlocked]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              const totalInCategory = progress.totalAchievements > 0 ? 
                Math.round((unlocked / progress.totalAchievements) * 100) : 0;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium capitalize">
                        {category === 'quiz' ? 'Quiz' : 
                         category === 'streak' ? 'Sequências' : 
                         category === 'social' ? 'Social' :
                         category === 'study' ? 'Estudo' :
                         category === 'group' ? 'Grupos' : 'Especial'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {unlocked} / {progress.totalAchievements}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {totalInCategory}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={totalInCategory} 
                    className="h-2"
                    style={{
                      '--progress-color': `var(--${category}-500)`
                    } as React.CSSProperties}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
