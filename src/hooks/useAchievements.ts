import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

// Cache para evitar refetches desnecessários
const achievementCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

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

  // Refs para controlar requests e debounce
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  // Função otimizada para buscar dados com cache e queries eficientes
  const fetchUserData = useCallback(
    async (forceRefresh = false) => {
      if (!userId) return;

      // Verificar cache primeiro
      const cacheKey = `achievements_${userId}`;
      const cached = achievementCache.get(cacheKey);

      if (
        !forceRefresh &&
        cached &&
        Date.now() - cached.timestamp < CACHE_DURATION
      ) {
        setAchievements(cached.data.achievements);
        setProgress(cached.data.progress);
        setLoading(false);
        return;
      }

      // Cancelar request anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Criar novo controller para este request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        setLoading(true);
        setError(null);

        // Debounce para evitar múltiplas chamadas
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(async () => {
          // Verificar se não foi cancelado durante o debounce
          if (signal.aborted) return;

          // Queries otimizadas com seleção específica de campos
          const [
            { data: quizResults, error: quizError },
            { data: userAnswers, error: answersError },
            { data: friendships, error: friendsError },
            { data: studyGroups, error: groupsError },
            { data: groupMembers, error: membersError },
            { data: goals, error: goalsError },
            { data: challenges, error: challengesError },
            { data: cadernos, error: cadernosError },
          ] = await Promise.allSettled([
            // Query otimizada para quiz_results - apenas campos necessários
            supabase
              .from("quiz_results")
              .select("percentage, completed_at")
              .eq("user_id", userId)
              .gte("percentage", 60) // Filtrar apenas resultados relevantes
              .order("completed_at", { ascending: false })
              .limit(50), // Limitar resultados para performance

            // Query otimizada para user_answers
            supabase
              .from("user_answers")
              .select("is_correct, answered_at")
              .eq("user_id", userId)
              .order("answered_at", { ascending: false })
              .limit(100),

            // Query otimizada para friendships
            supabase
              .from("friendships")
              .select("status")
              .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`),

            // Query otimizada para study_groups
            supabase.from("study_groups").select("id").eq("owner_id", userId),

            // Query otimizada para group_members
            supabase.from("group_members").select("id").eq("user_id", userId),

            // Query otimizada para goals
            supabase.from("goals").select("completed").eq("user_id", userId),

            // Query otimizada para challenges
            supabase
              .from("challenges")
              .select("completed")
              .eq("user_id", userId),

            // Query otimizada para cadernos
            supabase.from("cadernos").select("id").eq("user_id", userId),
          ]);

          // Verificar se foi cancelado
          if (signal.aborted) return;

          // Processar resultados com tratamento de erro
          const processedData = {
            quizResults: quizResults?.data || [],
            userAnswers: userAnswers?.data || [],
            friendships: friendships?.data || [],
            studyGroups: studyGroups?.data || [],
            groupMembers: groupMembers?.data || [],
            goals: goals?.data || [],
            challenges: challenges?.data || [],
            cadernos: cadernos?.data || [],
          };

          // Calcular conquistas
          const calculatedAchievements = calculateAchievements(processedData);
          const calculatedProgress = calculateProgress(calculatedAchievements);

          // Atualizar estado
          setAchievements(calculatedAchievements);
          setProgress(calculatedProgress);

          // Salvar no cache
          achievementCache.set(cacheKey, {
            data: {
              achievements: calculatedAchievements,
              progress: calculatedProgress,
            },
            timestamp: Date.now(),
          });

          setLoading(false);
          lastFetchRef.current = Date.now();
        }, 300); // Debounce de 300ms
      } catch (err) {
        if (!signal.aborted) {
          console.error("Erro ao buscar dados para conquistas:", err);
          setError("Erro ao carregar conquistas");
          setLoading(false);
        }
      }
    },
    [userId]
  );

  // Função otimizada para calcular conquistas
  const calculateAchievements = useCallback((userData: any): Achievement[] => {
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

    // Usar Set para operações mais eficientes
    const quizPercentages = new Set(quizResults.map((r: any) => r.percentage));
    const quizDates = quizResults
      .map((r: any) => r.completed_at)
      .filter(Boolean);

    // Conquistas baseadas em quiz_results com cache de cálculos
    const quizMasterProgress = quizResults.filter(
      (r: any) => r.percentage >= 80
    ).length;
    const quizStreakProgress = calculateQuizStreak(quizDates);
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
  }, []);

  // Função otimizada para calcular sequência de quizzes
  const calculateQuizStreak = useCallback((quizDates: string[]): number => {
    if (quizDates.length === 0) return 0;

    // Ordenar datas uma vez
    const sortedDates = quizDates.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    let currentStreak = 0;
    let maxStreak = 0;

    for (let i = 0; i < sortedDates.length; i++) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    }

    return maxStreak;
  }, []);

  // Função otimizada para calcular progresso geral
  const calculateProgress = useCallback(
    (achievements: Achievement[]): AchievementProgress => {
      const unlockedAchievements = achievements.filter((a) => a.unlocked);
      const totalPoints = unlockedAchievements.reduce(
        (sum, a) => sum + a.points,
        0
      );
      const level = Math.floor(totalPoints / 100) + 1;

      // Usar reduce para calcular progresso por categoria em uma passada
      const categoryProgress = achievements.reduce(
        (acc, achievement) => {
          if (achievement.unlocked) {
            acc[achievement.category]++;
          }
          return acc;
        },
        {
          social: 0,
          study: 0,
          quiz: 0,
          group: 0,
          streak: 0,
          special: 0,
        }
      );

      return {
        totalPoints,
        level,
        achievementsUnlocked: unlockedAchievements.length,
        totalAchievements: achievements.length,
        categoryProgress,
      };
    },
    []
  );

  // Memoizar conquistas para evitar recálculos desnecessários
  const memoizedAchievements = useMemo(() => achievements, [achievements]);
  const memoizedProgress = useMemo(() => progress, [progress]);

  // Função para limpar cache
  const clearCache = useCallback(() => {
    achievementCache.clear();
  }, []);

  // Função para recarregar conquistas
  const refreshAchievements = useCallback(() => {
    if (userId) {
      fetchUserData(true); // Force refresh
    }
  }, [userId, fetchUserData]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Buscar dados quando userId mudar
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId, fetchUserData]);

  return {
    achievements: memoizedAchievements,
    progress: memoizedProgress,
    loading,
    error,
    refreshAchievements,
    clearCache,
    lastFetch: lastFetchRef.current,
  };
};
