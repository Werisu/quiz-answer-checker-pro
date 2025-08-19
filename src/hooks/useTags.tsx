import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export type Tag = Tables<'tags'>;
export type CadernoTag = Tables<'caderno_tags'>;
export type QuizTag = Tables<'quiz_tags'>;
export type GoalTag = Tables<'goal_tags'>;

export interface TagWithRelations extends Tag {
  cadernos_count?: number;
  quizzes_count?: number;
  goals_count?: number;
}

export interface CreateTagData {
  name: string;
  color: string;
  description?: string;
}

export interface UpdateTagData {
  name?: string;
  color?: string;
  description?: string;
}

export const useTags = () => {
  const { user } = useAuth();
  const [tags, setTags] = useState<TagWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar todas as tags do usuário
  const fetchTags = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tags')
        .select(`
          *,
          cadernos_count:caderno_tags(count),
          quizzes_count:quiz_tags(count),
          goals_count:goal_tags(count)
        `)
        .eq('user_id', user.id)
        .order('name');

      if (fetchError) throw fetchError;

      // Processar contadores
      const processedTags = data?.map(tag => ({
        ...tag,
        cadernos_count: Array.isArray(tag.cadernos_count) ? tag.cadernos_count.length : 0,
        quizzes_count: Array.isArray(tag.quizzes_count) ? tag.quizzes_count.length : 0,
        goals_count: Array.isArray(tag.goals_count) ? tag.goals_count.length : 0,
      })) || [];

      setTags(processedTags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar tags');
      console.error('Erro ao buscar tags:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Criar nova tag
  const createTag = useCallback(async (tagData: CreateTagData): Promise<Tag | null> => {
    if (!user) return null;

    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('tags')
        .insert({
          ...tagData,
          user_id: user.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Atualizar lista local
      await fetchTags();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tag');
      console.error('Erro ao criar tag:', err);
      return null;
    }
  }, [user, fetchTags]);

  // Atualizar tag existente
  const updateTag = useCallback(async (tagId: string, updates: UpdateTagData): Promise<Tag | null> => {
    if (!user) return null;

    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', tagId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Atualizar lista local
      await fetchTags();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tag');
      console.error('Erro ao atualizar tag:', err);
      return null;
    }
  }, [user, fetchTags]);

  // Deletar tag
  const deleteTag = useCallback(async (tagId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Atualizar lista local
      await fetchTags();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar tag');
      console.error('Erro ao deletar tag:', err);
      return false;
    }
  }, [user, fetchTags]);

  // Adicionar tag a um caderno
  const addTagToCaderno = useCallback(async (cadernoId: string, tagId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: insertError } = await supabase
        .from('caderno_tags')
        .insert({
          caderno_id: cadernoId,
          tag_id: tagId,
        });

      if (insertError) throw insertError;

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar tag ao caderno');
      console.error('Erro ao adicionar tag ao caderno:', err);
      return false;
    }
  }, [user]);

  // Remover tag de um caderno
  const removeTagFromCaderno = useCallback(async (cadernoId: string, tagId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('caderno_tags')
        .delete()
        .eq('caderno_id', cadernoId)
        .eq('tag_id', tagId);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover tag do caderno');
      console.error('Erro ao remover tag do caderno:', err);
      return false;
    }
  }, [user]);

  // Adicionar tag a um quiz
  const addTagToQuiz = useCallback(async (quizId: string, tagId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: insertError } = await supabase
        .from('quiz_tags')
        .insert({
          quiz_id: quizId,
          tag_id: tagId,
        });

      if (insertError) throw insertError;

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar tag ao quiz');
      console.error('Erro ao adicionar tag ao quiz:', err);
      return false;
    }
  }, [user]);

  // Remover tag de um quiz
  const removeTagFromQuiz = useCallback(async (quizId: string, tagId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('quiz_tags')
        .delete()
        .eq('quiz_id', quizId)
        .eq('tag_id', tagId);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover tag do quiz');
      console.error('Erro ao remover tag do quiz:', err);
      return false;
    }
  }, [user]);

  // Adicionar tag a uma meta
  const addTagToGoal = useCallback(async (goalId: string, tagId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: insertError } = await supabase
        .from('goal_tags')
        .insert({
          goal_id: goalId,
          tag_id: tagId,
        });

      if (insertError) throw insertError;

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar tag à meta');
      console.error('Erro ao adicionar tag à meta:', err);
      return false;
    }
  }, [user]);

  // Remover tag de uma meta
  const removeTagFromGoal = useCallback(async (goalId: string, tagId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('goal_tags')
        .delete()
        .eq('goal_id', goalId)
        .eq('tag_id', tagId);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover tag da meta');
      console.error('Erro ao remover tag da meta:', err);
      return false;
    }
  }, [user]);

  // Buscar tags de um caderno específico
  const getCadernoTags = useCallback(async (cadernoId: string): Promise<Tag[]> => {
    if (!user) return [];

    try {
      const { data, error: fetchError } = await supabase
        .from('caderno_tags')
        .select(`
          tag_id,
          tags (*)
        `)
        .eq('caderno_id', cadernoId);

      if (fetchError) throw fetchError;

      return data?.map(item => item.tags as Tag) || [];
    } catch (err) {
      console.error('Erro ao buscar tags do caderno:', err);
      return [];
    }
  }, [user]);

  // Buscar tags de um quiz específico
  const getQuizTags = useCallback(async (quizId: string): Promise<Tag[]> => {
    if (!user) return [];

    try {
      const { data, error: fetchError } = await supabase
        .from('quiz_tags')
        .select(`
          tag_id,
          tags (*)
        `)
        .eq('quiz_id', quizId);

      if (fetchError) throw fetchError;

      return data?.map(item => item.tags as Tag) || [];
    } catch (err) {
      console.error('Erro ao buscar tags do quiz:', err);
      return [];
    }
  }, [user]);

  // Buscar tags de uma meta específica
  const getGoalTags = useCallback(async (goalId: string): Promise<Tag[]> => {
    if (!user) return [];

    try {
      const { data, error: fetchError } = await supabase
        .from('goal_tags')
        .select(`
          tag_id,
          tags (*)
        `)
        .eq('goal_id', goalId);

      if (fetchError) throw fetchError;

      return data?.map(item => item.tags as Tag) || [];
    } catch (err) {
      console.error('Erro ao buscar tags da meta:', err);
      return [];
    }
  }, [user]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Buscar tags quando o usuário mudar
  useEffect(() => {
    if (user) {
      fetchTags();
    } else {
      setTags([]);
    }
  }, [user, fetchTags]);

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    addTagToCaderno,
    removeTagFromCaderno,
    addTagToQuiz,
    removeTagFromQuiz,
    addTagToGoal,
    removeTagFromGoal,
    getCadernoTags,
    getQuizTags,
    getGoalTags,
    clearError,
  };
};
