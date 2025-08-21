import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "social" | "study" | "quiz" | "group" | "streak" | "special";
  points: number;
  icon: "trophy" | "star" | "zap" | "users" | "book" | "target" | "award";
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirements: string[];
}

export interface AchievementProgress {
  totalPoints: number;
  level: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  categoryProgress: {
    social: number;
    study: number;
    quiz: number;
    group: number;
    streak: number;
    special: number;
  };
}

export const useAchievements = (userId: string) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<AchievementProgress>({
    totalPoints: 0,
    level: 1,
    achievementsUnlocked: 0,
    totalAchievements: 6,
    categoryProgress: {
      social: 0,
      study: 0,
      quiz: 0,
      group: 0,
      streak: 0,
      special: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados do usuário para calcular conquistas
  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Buscar dados em paralelo
      const [
        { data: quizResults },
        { data: userAnswers },
        { data: friendships },
        { data: studyGroups },
        { data: groupMembers },
        { data: goals },
        { data: challenges },
        { data: cadernos },
      ] = await Promise.all([
        supabase.from("quiz_results").select("*").eq("user_id", userId),
        supabase.from("user_answers").select("*").eq("user_id", userId),
        supabase
          .from("friendships")
          .select("*")
          .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`),
        supabase.from("study_groups").select("*").eq("owner_id", userId),
        supabase.from("group_members").select("*").eq("user_id", userId),
        supabase.from("goals").select("*").eq("user_id", userId),
        supabase.from("challenges").select("*").eq("user_id", userId),
        supabase.from("cadernos").select("*").eq("user_id", userId),
      ]);

      // Calcular conquistas baseadas nos dados reais
      const calculatedAchievements = calculateAchievements({
        quizResults: quizResults || [],
        userAnswers: userAnswers || [],
        friendships: friendships || [],
        studyGroups: studyGroups || [],
        groupMembers: groupMembers || [],
        goals: goals || [],
        challenges: challenges || [],
        cadernos: cadernos || [],
      });

      setAchievements(calculatedAchievements);

      // Calcular progresso geral
      const calculatedProgress = calculateProgress(calculatedAchievements);
      setProgress(calculatedProgress);
    } catch (err) {
      console.error("Erro ao buscar dados para conquistas:", err);
      setError("Erro ao carregar conquistas");
    } finally {
      setLoading(false);
    }
  };

  // Calcular conquistas baseadas nos dados reais
  const calculateAchievements = (userData: any): Achievement[] => {
    const {
      quizResults,
      userAnswers,
      friendships,
      studyGroups,
      groupMembers,
      goals,
      challenges,
      cadernos,
    } = userData;

    // Conquistas baseadas em quiz_results
    const quizMasterProgress = quizResults.filter(
      (r: any) => r.percentage >= 80
    ).length;
    const quizStreakProgress = calculateQuizStreak(quizResults);
    const perfectQuizProgress = quizResults.filter(
      (r: any) => r.percentage === 100
    ).length;

    // Conquistas baseadas em friendships
    const acceptedFriendships = friendships.filter(
      (f: any) => f.status === "accepted"
    ).length;

    // Conquistas baseadas em study_groups
    const ownedGroups = studyGroups.length;
    const participatedGroups = groupMembers.length;

    // Conquistas baseadas em goals
    const completedGoals = goals.filter((g: any) => g.completed).length;

    // Conquistas baseadas em challenges
    const completedChallenges = challenges.filter(
      (c: any) => c.completed
    ).length;

    // Conquistas baseadas em cadernos
    const createdCadernos = cadernos.length;

    return [
      // CONQUISTAS DE QUIZ
      {
        id: "quiz_master",
        title: "Mestre dos Quizzes",
        description: "Complete 10 quizzes com 80%+ de acerto",
        category: "quiz",
        points: 100,
        icon: "target",
        rarity: "rare",
        progress: Math.min(quizMasterProgress, 10),
        maxProgress: 10,
        unlocked: quizMasterProgress >= 10,
        unlockedAt:
          quizMasterProgress >= 10 ? new Date().toISOString() : undefined,
        requirements: ["Complete 10 quizzes com 80%+ de acerto"],
      },
      {
        id: "perfect_score",
        title: "Nota Perfeita",
        description: "Acerte 100% em 3 quizzes",
        category: "quiz",
        points: 150,
        icon: "star",
        rarity: "epic",
        progress: Math.min(perfectQuizProgress, 3),
        maxProgress: 3,
        unlocked: perfectQuizProgress >= 3,
        unlockedAt:
          perfectQuizProgress >= 3 ? new Date().toISOString() : undefined,
        requirements: ["Acerte 100% em 3 quizzes"],
      },
      {
        id: "quiz_streak",
        title: "Sequência de Sucesso",
        description: "Complete 5 quizzes consecutivos",
        category: "streak",
        points: 75,
        icon: "zap",
        rarity: "rare",
        progress: Math.min(quizStreakProgress, 5),
        maxProgress: 5,
        unlocked: quizStreakProgress >= 5,
        unlockedAt:
          quizStreakProgress >= 5 ? new Date().toISOString() : undefined,
        requirements: ["Complete 5 quizzes consecutivos"],
      },

      // CONQUISTAS SOCIAIS
      {
        id: "social_butterfly",
        title: "Borboleta Social",
        description: "Tenha 5 amigos",
        category: "social",
        points: 50,
        icon: "users",
        rarity: "common",
        progress: Math.min(acceptedFriendships, 5),
        maxProgress: 5,
        unlocked: acceptedFriendships >= 5,
        unlockedAt:
          acceptedFriendships >= 5 ? new Date().toISOString() : undefined,
        requirements: ["Tenha 5 amigos"],
      },
      {
        id: "friend_collector",
        title: "Colecionador de Amigos",
        description: "Tenha 15 amigos",
        category: "social",
        points: 100,
        icon: "users",
        rarity: "rare",
        progress: Math.min(acceptedFriendships, 15),
        maxProgress: 15,
        unlocked: acceptedFriendships >= 15,
        unlockedAt:
          acceptedFriendships >= 15 ? new Date().toISOString() : undefined,
        requirements: ["Tenha 15 amigos"],
      },

      // CONQUISTAS DE GRUPO
      {
        id: "group_leader",
        title: "Líder de Grupo",
        description: "Crie 3 grupos de estudo",
        category: "group",
        points: 150,
        icon: "users",
        rarity: "epic",
        progress: Math.min(ownedGroups, 3),
        maxProgress: 3,
        unlocked: ownedGroups >= 3,
        unlockedAt: ownedGroups >= 3 ? new Date().toISOString() : undefined,
        requirements: ["Crie 3 grupos de estudo"],
      },
      {
        id: "group_participant",
        title: "Participante Ativo",
        description: "Participe de 5 grupos",
        category: "group",
        points: 80,
        icon: "users",
        rarity: "common",
        progress: Math.min(participatedGroups, 5),
        maxProgress: 5,
        unlocked: participatedGroups >= 5,
        unlockedAt:
          participatedGroups >= 5 ? new Date().toISOString() : undefined,
        requirements: ["Participe de 5 grupos"],
      },

      // CONQUISTAS DE ESTUDO
      {
        id: "goal_setter",
        title: "Definidor de Metas",
        description: "Complete 5 metas",
        category: "study",
        points: 75,
        icon: "target",
        rarity: "common",
        progress: Math.min(completedGoals, 5),
        maxProgress: 5,
        unlocked: completedGoals >= 5,
        unlockedAt: completedGoals >= 5 ? new Date().toISOString() : undefined,
        requirements: ["Complete 5 metas"],
      },
      {
        id: "challenge_accepter",
        title: "Aceitador de Desafios",
        description: "Complete 3 desafios",
        category: "study",
        points: 100,
        icon: "zap",
        rarity: "rare",
        progress: Math.min(completedChallenges, 3),
        maxProgress: 3,
        unlocked: completedChallenges >= 3,
        unlockedAt:
          completedChallenges >= 3 ? new Date().toISOString() : undefined,
        requirements: ["Complete 3 desafios"],
      },
      {
        id: "note_taker",
        title: "Tomador de Notas",
        description: "Crie 5 cadernos",
        category: "study",
        points: 60,
        icon: "book",
        rarity: "common",
        progress: Math.min(createdCadernos, 5),
        maxProgress: 5,
        unlocked: createdCadernos >= 5,
        unlockedAt: createdCadernos >= 5 ? new Date().toISOString() : undefined,
        requirements: ["Crie 5 cadernos"],
      },
    ];
  };

  // Calcular sequência de quizzes
  const calculateQuizStreak = (quizResults: any[]): number => {
    if (quizResults.length === 0) return 0;

    // Ordenar por data de conclusão
    const sortedResults = quizResults
      .filter((r) => r.completed_at)
      .sort(
        (a, b) =>
          new Date(a.completed_at).getTime() -
          new Date(b.completed_at).getTime()
      );

    let currentStreak = 0;
    let maxStreak = 0;

    for (let i = 0; i < sortedResults.length; i++) {
      if (sortedResults[i].percentage >= 60) {
        // Considerar 60%+ como sucesso
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  };

  // Calcular progresso geral
  const calculateProgress = (
    achievements: Achievement[]
  ): AchievementProgress => {
    const unlockedAchievements = achievements.filter((a) => a.unlocked);
    const totalPoints = unlockedAchievements.reduce(
      (sum, a) => sum + a.points,
      0
    );
    const level = Math.floor(totalPoints / 100) + 1;

    const categoryProgress = {
      social: achievements.filter((a) => a.category === "social" && a.unlocked)
        .length,
      study: achievements.filter((a) => a.category === "study" && a.unlocked)
        .length,
      quiz: achievements.filter((a) => a.category === "quiz" && a.unlocked)
        .length,
      group: achievements.filter((a) => a.category === "group" && a.unlocked)
        .length,
      streak: achievements.filter((a) => a.category === "streak" && a.unlocked)
        .length,
      special: achievements.filter(
        (a) => a.category === "special" && a.unlocked
      ).length,
    };

    return {
      totalPoints,
      level,
      achievementsUnlocked: unlockedAchievements.length,
      totalAchievements: achievements.length,
      categoryProgress,
    };
  };

  // Buscar dados quando userId mudar
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Função para recarregar conquistas
  const refreshAchievements = () => {
    if (userId) {
      fetchUserData();
    }
  };

  return {
    achievements,
    progress,
    loading,
    error,
    refreshAchievements,
  };
};
