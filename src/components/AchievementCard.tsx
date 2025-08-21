import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, BookOpen, Lock, Star, Target, Trophy, Users, Zap } from 'lucide-react';
import React from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'social' | 'study' | 'quiz' | 'group' | 'streak' | 'special';
  points: number;
  icon: 'trophy' | 'star' | 'zap' | 'users' | 'book' | 'target' | 'award';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
  unlocked?: boolean;
  unlockedAt?: string;
  requirements: string[];
}

interface AchievementCardProps {
  achievement: Achievement;
  onUnlock?: (achievementId: string) => void;
  showProgress?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const getIconComponent = (icon: string) => {
  switch (icon) {
    case 'trophy':
      return <Trophy className="w-6 h-6" />;
    case 'star':
      return <Star className="w-6 h-6" />;
    case 'zap':
      return <Zap className="w-6 h-6" />;
    case 'users':
      return <Users className="w-6 h-6" />;
    case 'book':
      return <BookOpen className="w-6 h-6" />;
    case 'target':
      return <Target className="w-6 h-6" />;
    case 'award':
      return <Award className="w-6 h-6" />;
    default:
      return <Trophy className="w-6 h-6" />;
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    case 'rare':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'epic':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'legendary':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'social':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'study':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'quiz':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'group':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'streak':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'special':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onUnlock,
  showProgress = true,
  variant = 'default'
}) => {
  const isUnlocked = achievement.unlocked || false;
  const progress = achievement.progress || 0;
  const maxProgress = achievement.maxProgress || 1;
  const progressPercentage = Math.min((progress / maxProgress) * 100, 100);

  if (variant === 'compact') {
    return (
      <Card className={`transition-all duration-300 hover:shadow-lg ${
        isUnlocked 
          ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              isUnlocked 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
            }`}>
              {isUnlocked ? getIconComponent(achievement.icon) : <Lock className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm truncate ${
                isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {achievement.title}
              </h3>
              {showProgress && !isUnlocked && (
                <div className="mt-1">
                  <Progress value={progressPercentage} className="h-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {progress}/{maxProgress}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge variant="secondary" className={getRarityColor(achievement.rarity)}>
                {achievement.points} XP
              </Badge>
              {isUnlocked && (
                <Badge variant="outline" className="text-xs">
                  Desbloqueado
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      isUnlocked 
        ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${
              isUnlocked 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
            }`}>
              {isUnlocked ? getIconComponent(achievement.icon) : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <CardTitle className={`text-lg ${
                isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {achievement.title}
              </CardTitle>
              <CardDescription className={`${
                isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {achievement.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="secondary" className={getRarityColor(achievement.rarity)}>
              {achievement.rarity.toUpperCase()}
            </Badge>
            <Badge variant="outline" className={getCategoryColor(achievement.category)}>
              {achievement.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Section */}
        {showProgress && !isUnlocked && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progresso</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {progress}/{maxProgress}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(progressPercentage)}% completo
            </p>
          </div>
        )}

        {/* Requirements */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Requisitos:</h4>
          <ul className="space-y-1">
            {achievement.requirements.map((requirement, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className={`w-2 h-2 rounded-full ${
                  isUnlocked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Points and Status */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {achievement.points} XP
            </span>
          </div>
          
          {isUnlocked ? (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">
                <Trophy className="w-3 h-3 mr-1" />
                Desbloqueado
              </Badge>
              {achievement.unlockedAt && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-gray-400 border-gray-300 dark:border-gray-600"
            >
              Bloqueado
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
