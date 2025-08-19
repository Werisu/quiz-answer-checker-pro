import { useMemo } from 'react';
import { useGoalsAndChallenges } from './useGoalsAndChallenges';

export interface UserLevel {
  level: number;
  title: string;
  icon: string;
  totalPoints: number;
  nextLevelPoints: number;
  progressToNextLevel: number;
}

export const useUserLevel = (): UserLevel => {
  const { goals, challenges } = useGoalsAndChallenges();

  const userLevel = useMemo((): UserLevel => {
    // Verificar se os dados estão disponíveis
    if (!goals || !challenges) {
      return {
        level: 1,
        title: 'Iniciante',
        icon: '🌱',
        totalPoints: 0,
        nextLevelPoints: 100,
        progressToNextLevel: 0
      };
    }

    // Calcular pontos totais
    const goalPoints = goals.filter(g => g.completed).reduce((sum, g) => sum + (g.points || 0), 0);
    const challengePoints = challenges.filter(c => c.completed).reduce((sum, c) => sum + (c.points || 0), 0);
    const totalPoints = goalPoints + challengePoints;

    // Calcular nível do usuário
    let level: number;
    let title: string;
    let icon: string;

    if (totalPoints < 100) {
      level = 1;
      title = 'Iniciante';
      icon = '🌱';
    } else if (totalPoints < 300) {
      level = 2;
      title = 'Estudante';
      icon = '📚';
    } else if (totalPoints < 600) {
      level = 3;
      title = 'Aplicado';
      icon = '🎯';
    } else if (totalPoints < 1000) {
      level = 4;
      title = 'Dedicado';
      icon = '🏆';
    } else {
      level = 5;
      title = 'Mestre';
      icon = '👑';
    }

    // Calcular próximo nível
    const levels = [100, 300, 600, 1000, Infinity];
    const currentLevelIndex = levels.findIndex(threshold => totalPoints < threshold);
    const nextLevelPoints = currentLevelIndex >= 0 && currentLevelIndex < levels.length 
      ? levels[currentLevelIndex] 
      : Infinity;

    // Calcular progresso para o próximo nível
    const levelThresholds = [0, 100, 300, 600, 1000];
    const currentLevelStart = levelThresholds[level - 1] || 0;
    const progressToNextLevel = nextLevelPoints !== Infinity 
      ? ((totalPoints - currentLevelStart) / (nextLevelPoints - currentLevelStart)) * 100
      : 100;

    return {
      level,
      title,
      icon,
      totalPoints,
      nextLevelPoints,
      progressToNextLevel
    };
  }, [goals, challenges]);

  return userLevel;
};
