import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useEffect, useState } from 'react';

type Goal = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];
type GoalUpdate = Database['public']['Tables']['goals']['Update'];

type Challenge = Database['public']['Tables']['challenges']['Row'];
type ChallengeInsert = Database['public']['Tables']['challenges']['Insert'];
type ChallengeUpdate = Database['public']['Tables']['challenges']['Update'];

export const useGoalsAndChallenges = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar metas e desafios
  const loadGoalsAndChallenges = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Carregar metas
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (goalsError) {
        console.error('Erro ao carregar metas:', goalsError);
      }

      // Carregar desafios
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (challengesError) {
        console.error('Erro ao carregar desafios:', challengesError);
      }

      setGoals(goalsData || []);
      setChallenges(challengesData || []);
    } catch (error) {
      console.error('Erro ao carregar metas e desafios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Criar nova meta
  const createGoal = async (goalData: Omit<GoalInsert, 'user_id'>) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([goalData])
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      throw error;
    }
  };

  // Atualizar meta
  const updateGoal = async (id: string, updates: GoalUpdate) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      throw error;
    }
  };

  // Deletar meta
  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      throw error;
    }
  };

  // Criar novo desafio
  const createChallenge = async (challengeData: Omit<ChallengeInsert, 'user_id'>) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const { data, error } = await supabase
        .from('challenges')
        .insert([challengeData])
        .select()
        .single();

      if (error) throw error;

      setChallenges(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Erro ao criar desafio:', error);
      throw error;
    }
  };

  // Atualizar desafio
  const updateChallenge = async (id: string, updates: ChallengeUpdate) => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setChallenges(prev => prev.map(challenge => challenge.id === id ? data : challenge));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar desafio:', error);
      throw error;
    }
  };

  // Deletar desafio
  const deleteChallenge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setChallenges(prev => prev.filter(challenge => challenge.id !== id));
    } catch (error) {
      console.error('Erro ao deletar desafio:', error);
      throw error;
    }
  };

  // Atualizar progresso de uma meta
  const updateGoalProgress = async (id: string, current: number, completed: boolean) => {
    return updateGoal(id, { current, completed });
  };

  // Atualizar progresso de um desafio
  const updateChallengeProgress = async (id: string, currentPercentage: number, completed: boolean) => {
    return updateChallenge(id, { current_percentage: currentPercentage, completed });
  };

  // Carregar dados quando o usuário mudar
  useEffect(() => {
    if (user) {
      loadGoalsAndChallenges();
    } else {
      setGoals([]);
      setChallenges([]);
    }
  }, [user]);

  return {
    goals,
    challenges,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    updateGoalProgress,
    updateChallengeProgress,
    loadGoalsAndChallenges,
  };
};

