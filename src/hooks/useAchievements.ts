import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useCallback, useEffect, useState } from "react";

type GoalAchievement = Database["public"]["Tables"]["goal_achievements"]["Row"];
type ChallengeAchievement =
  Database["public"]["Tables"]["challenge_achievements"]["Row"];

export const useAchievements = () => {
  const [goalAchievements, setGoalAchievements] = useState<GoalAchievement[]>(
    []
  );
  const [challengeAchievements, setChallengeAchievements] = useState<
    ChallengeAchievement[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Buscar achievements de metas do usuário
  const fetchGoalAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("goal_achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("achieved_at", { ascending: false });

      if (error) throw error;
      setGoalAchievements(data || []);
    } catch (error) {
      console.error("Erro ao buscar achievements de metas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar achievements de desafios do usuário
  const fetchChallengeAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("challenge_achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("achieved_at", { ascending: false });

      if (error) throw error;
      setChallengeAchievements(data || []);
    } catch (error) {
      console.error("Erro ao buscar achievements de desafios:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Registrar conquista de meta
  const recordGoalAchievement = useCallback(
    async (goalId: string, pointsEarned: number, progressValue: number) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        const { data, error } = await supabase
          .from("goal_achievements")
          .insert({
            goal_id: goalId,
            user_id: user.id,
            points_earned: pointsEarned,
            progress_value: progressValue,
          })
          .select()
          .single();

        if (error) throw error;

        // Atualizar estado local
        setGoalAchievements((prev) => [data, ...prev]);

        console.log("Achievement de meta registrado:", data);
        return data;
      } catch (error) {
        console.error("Erro ao registrar achievement de meta:", error);
        throw error;
      }
    },
    []
  );

  // Registrar conquista de desafio
  const recordChallengeAchievement = useCallback(
    async (
      challengeId: string,
      pointsEarned: number,
      finalPercentage: number
    ) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        const { data, error } = await supabase
          .from("challenge_achievements")
          .insert({
            challenge_id: challengeId,
            user_id: user.id,
            points_earned: pointsEarned,
            final_percentage: finalPercentage,
          })
          .select()
          .single();

        if (error) throw error;

        // Atualizar estado local
        setChallengeAchievements((prev) => [data, ...prev]);

        console.log("Achievement de desafio registrado:", data);
        return data;
      } catch (error) {
        console.error("Erro ao registrar achievement de desafio:", error);
        throw error;
      }
    },
    []
  );

  // Calcular pontos totais baseado nos achievements
  const calculateTotalPoints = useCallback(() => {
    const goalPoints = goalAchievements.reduce(
      (sum, achievement) => sum + achievement.points_earned,
      0
    );
    const challengePoints = challengeAchievements.reduce(
      (sum, achievement) => sum + achievement.points_earned,
      0
    );
    return goalPoints + challengePoints;
  }, [goalAchievements, challengeAchievements]);

  // Verificar se uma meta já foi conquistada hoje
  const isGoalAchievedToday = useCallback(
    (goalId: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return goalAchievements.some((achievement) => {
        const achievementDate = new Date(achievement.achieved_at);
        achievementDate.setHours(0, 0, 0, 0);
        return (
          achievement.goal_id === goalId &&
          achievementDate.getTime() === today.getTime()
        );
      });
    },
    [goalAchievements]
  );

  // Verificar se um desafio já foi conquistado
  const isChallengeAchieved = useCallback(
    (challengeId: string) => {
      return challengeAchievements.some(
        (achievement) => achievement.challenge_id === challengeId
      );
    },
    [challengeAchievements]
  );

  // Buscar achievements por período
  const getAchievementsByPeriod = useCallback(
    (startDate: Date, endDate: Date) => {
      const start = startDate.getTime();
      const end = endDate.getTime();

      const goalsInPeriod = goalAchievements.filter((achievement) => {
        const achievementTime = new Date(achievement.achieved_at).getTime();
        return achievementTime >= start && achievementTime <= end;
      });

      const challengesInPeriod = challengeAchievements.filter((achievement) => {
        const achievementTime = new Date(achievement.achieved_at).getTime();
        return achievementTime >= start && achievementTime <= end;
      });

      return {
        goals: goalsInPeriod,
        challenges: challengesInPeriod,
        totalPoints:
          goalsInPeriod.reduce((sum, g) => sum + g.points_earned, 0) +
          challengesInPeriod.reduce((sum, c) => sum + c.points_earned, 0),
      };
    },
    [goalAchievements, challengeAchievements]
  );

  // Carregar dados iniciais
  useEffect(() => {
    fetchGoalAchievements();
    fetchChallengeAchievements();
  }, [fetchGoalAchievements, fetchChallengeAchievements]);

  return {
    goalAchievements,
    challengeAchievements,
    loading,
    fetchGoalAchievements,
    fetchChallengeAchievements,
    recordGoalAchievement,
    recordChallengeAchievement,
    calculateTotalPoints,
    isGoalAchievedToday,
    isChallengeAchieved,
    getAchievementsByPeriod,
  };
};
