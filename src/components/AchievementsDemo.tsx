import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useState } from 'react';
import { Achievement, AchievementCard } from './AchievementCard';
import { AchievementList } from './AchievementList';
import { Leaderboard, LeaderboardUser } from './Leaderboard';
import { ProgressTracker } from './ProgressTracker';

// Mock data para demonstração
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Primeira Amizade',
    description: 'Faça sua primeira amizade na plataforma',
    category: 'social',
    points: 50,
    icon: 'users',
    rarity: 'common',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    requirements: ['Adicionar um amigo'],
    progress: 1,
    maxProgress: 1
  },
  {
    id: '2',
    title: 'Estudioso Dedicado',
    description: 'Complete 10 quizzes com sucesso',
    category: 'study',
    points: 100,
    icon: 'book',
    rarity: 'rare',
    unlocked: false,
    requirements: ['Completar 10 quizzes'],
    progress: 7,
    maxProgress: 10
  },
  {
    id: '3',
    title: 'Líder de Grupo',
    description: 'Crie e gerencie um grupo de estudo',
    category: 'group',
    points: 150,
    icon: 'users',
    rarity: 'epic',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    requirements: ['Criar um grupo', 'Ter 5 membros'],
    progress: 2,
    maxProgress: 2
  },
  {
    id: '4',
    title: 'Quiz Master',
    description: 'Acerte 100% em um quiz difícil',
    category: 'quiz',
    points: 200,
    icon: 'target',
    rarity: 'legendary',
    unlocked: false,
    requirements: ['Acerte todas as questões de um quiz'],
    progress: 0,
    maxProgress: 1
  },
  {
    id: '5',
    title: 'Sequência de Estudo',
    description: 'Estude por 7 dias consecutivos',
    category: 'streak',
    points: 75,
    icon: 'zap',
    rarity: 'rare',
    unlocked: false,
    requirements: ['Estudar por 7 dias seguidos'],
    progress: 4,
    maxProgress: 7
  },
  {
    id: '6',
    title: 'Colaborador Ativo',
    description: 'Participe de 5 discussões em grupo',
    category: 'social',
    points: 80,
    icon: 'users',
    rarity: 'common',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    requirements: ['Participar de 5 discussões'],
    progress: 5,
    maxProgress: 5
  }
];

const mockLeaderboardUsers: LeaderboardUser[] = [
  {
    id: '1',
    name: 'João Silva',
    avatar: 'https://github.com/shadcn.png',
    points: 1250,
    level: 5,
    achievements: 12,
    rank: 1,
    category: 'overall',
    change: 'up',
    streak: 15
  },
  {
    id: '2',
    name: 'Maria Santos',
    avatar: 'https://github.com/shadcn.png',
    points: 980,
    level: 4,
    achievements: 8,
    rank: 2,
    category: 'overall',
    change: 'same',
    streak: 8
  },
  {
    id: '3',
    name: 'Pedro Costa',
    avatar: 'https://github.com/shadcn.png',
    points: 750,
    level: 3,
    achievements: 6,
    rank: 3,
    category: 'overall',
    change: 'down',
    streak: 3
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    avatar: 'https://github.com/shadcn.png',
    points: 650,
    level: 3,
    achievements: 5,
    rank: 4,
    category: 'overall',
    change: 'up',
    streak: 12
  },
  {
    id: '5',
    name: 'Carlos Ferreira',
    avatar: 'https://github.com/shadcn.png',
    points: 580,
    level: 2,
    achievements: 4,
    rank: 5,
    category: 'overall',
    change: 'up',
    streak: 6
  }
];

export const AchievementsDemo: React.FC = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    console.log('Achievement clicked:', achievement);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            🏆 Sistema de Conquistas
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Demonstração completa dos componentes de gamificação
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Tracker Compact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Seu Progresso
                </h3>
                <ProgressTracker 
                  achievements={mockAchievements} 
                  variant="compact"
                  showDetails={false}
                />
              </div>

              {/* Top 3 Leaderboard */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top 3 do Ranking
                </h3>
                <Leaderboard 
                  users={mockLeaderboardUsers} 
                  variant="compact"
                  showStats={false}
                  showFilters={false}
                />
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Conquistas Recentes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockAchievements
                  .filter(a => a.unlocked)
                  .slice(0, 3)
                  .map((achievement) => (
                    <div key={achievement.id} onClick={() => handleAchievementClick(achievement)}>
                      <AchievementCard 
                        achievement={achievement} 
                        variant="compact"
                        showProgress={false}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <AchievementList 
              achievements={mockAchievements}
              onAchievementClick={handleAchievementClick}
              showFilters={true}
              showStats={true}
              variant="grid"
            />
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <ProgressTracker 
              achievements={mockAchievements}
              showDetails={true}
              variant="default"
            />
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard 
              users={mockLeaderboardUsers}
              currentUserId="4" // Simular usuário atual
              showFilters={true}
              showStats={true}
              variant="default"
            />
          </TabsContent>
        </Tabs>

        {/* Selected Achievement Modal */}
        {selectedAchievement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Detalhes da Conquista
                  </h3>
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <AchievementCard 
                  achievement={selectedAchievement}
                  variant="detailed"
                  showProgress={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
