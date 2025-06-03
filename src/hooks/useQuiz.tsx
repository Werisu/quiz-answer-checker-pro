import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  creator_id: string;
  is_public: boolean;
  created_at: string;
  questions: Question[];
  pdf_name?: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_number: number;
  text: string | null;
  correct_answer: string | null;
  status: 'correct' | 'incorrect' | 'unanswered';
}

export interface UserAnswer {
  id: string;
  user_id: string;
  question_id: string;
  user_answer: string | null;
  is_correct: boolean;
  answered_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_id: string;
  correct_answers: number;
  wrong_answers: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
  quiz?: {
    title: string;
    description: string | null;
    pdf_name: string | null;
  };
  profiles?: { name: string };
}

export const useQuiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [allResults, setAllResults] = useState<QuizResult[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchQuizHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select(`
          *,
          quiz:quizzes (
            title,
            description,
            pdf_name
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setQuizHistory(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar histórico",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllResults = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select(`
          *,
          quiz:quizzes(title),
          profiles(name)
        `)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setAllResults(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar resultados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteQuizHistory = async (resultId: string) => {
    if (!user) {
      toast({
        title: "Erro ao remover quiz",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Iniciando deleção do quiz:', resultId);
      console.log('Usuário atual:', user.id);

      // Primeiro, verifica se o resultado existe e pertence ao usuário
      const { data: existingResult, error: checkError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('id', resultId)
        .eq('user_id', user.id)
        .single();

      console.log('Resultado da verificação:', { existingResult, checkError });

      if (checkError) {
        console.error('Erro na verificação:', checkError);
        throw new Error('Não foi possível verificar o resultado do quiz');
      }

      if (!existingResult) {
        throw new Error('Quiz não encontrado ou não pertence ao usuário');
      }

      // Deleta as respostas do usuário relacionadas a este quiz
      const { error: deleteAnswersError } = await supabase
        .from('user_answers')
        .delete()
        .eq('user_id', user.id)
        .eq('question_id', existingResult.quiz_id);

      if (deleteAnswersError) {
        console.error('Erro ao deletar respostas:', deleteAnswersError);
        throw new Error('Erro ao deletar respostas do usuário');
      }

      // Deleta o resultado do quiz
      const { error: deleteError } = await supabase
        .from('quiz_results')
        .delete()
        .eq('id', resultId)
        .eq('user_id', user.id);

      console.log('Resultado da deleção:', { deleteError });

      if (deleteError) {
        console.error('Erro na deleção:', deleteError);
        throw deleteError;
      }

      // Atualiza o histórico local
      setQuizHistory(prev => prev.filter(result => result.id !== resultId));
      
      toast({
        title: "Quiz removido",
        description: "O quiz foi removido do seu histórico com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao deletar quiz:', error);
      toast({
        title: "Erro ao remover quiz",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao remover o quiz",
        variant: "destructive",
      });
    }
  };

  const createQuiz = async (title: string, questionCount: number, pdfName: string, description: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          title,
          description: description || `Quiz com ${questionCount} questões`,
          creator_id: user.id,
          is_public: true,
          pdf_name: pdfName,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      // Create questions
      const questions = Array.from({ length: questionCount }, (_, i) => ({
        quiz_id: quiz.id,
        question_number: i + 1,
        text: `Questão ${i + 1}`,
      }));

      const { data: createdQuestions, error: questionsError } = await supabase
        .from('questions')
        .insert(questions)
        .select();

      if (questionsError) throw questionsError;

      const quizWithQuestions: Quiz = {
        ...quiz,
        questions: createdQuestions.map(q => ({
          ...q,
          status: 'unanswered' as const,
        })),
      };

      setCurrentQuiz(quizWithQuestions);
      toast({
        title: "Quiz criado!",
        description: `${questionCount} questões prontas para serem respondidas.`,
      });

      return quizWithQuestions;
    } catch (error: any) {
      toast({
        title: "Erro ao criar quiz",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = async (questionId: string, status: 'correct' | 'incorrect' | 'unanswered') => {
    if (!user || !currentQuiz) return;

    try {
      if (status === 'unanswered') {
        // Remove answer
        await supabase
          .from('user_answers')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', questionId);
      } else {
        // Upsert answer com onConflict
        const { error } = await supabase
          .from('user_answers')
          .upsert(
            {
              user_id: user.id,
              question_id: questionId,
              user_answer: status,
              is_correct: status === 'correct',
            },
            {
              onConflict: 'user_id,question_id',
              ignoreDuplicates: false
            }
          );

        if (error) throw error;
      }

      // Update local state
      setCurrentQuiz(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: prev.questions.map(q =>
            q.id === questionId ? { ...q, status } : q
          ),
        };
      });

    } catch (error: any) {
      toast({
        title: "Erro ao salvar resposta",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveResults = async () => {
    if (!user || !currentQuiz) return;

    // Verifica se o quiz já foi salvo
    const { data: existingResults, error: checkError } = await supabase
      .from('quiz_results')
      .select('id')
      .eq('user_id', user.id)
      .eq('quiz_id', currentQuiz.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 é o código de "não encontrado"
      throw checkError;
    }

    if (existingResults) {
      toast({
        title: "Quiz já salvo",
        description: "Este quiz já foi salvo anteriormente.",
        variant: "destructive",
      });
      return;
    }

    const correct = currentQuiz.questions.filter(q => q.status === 'correct').length;
    const incorrect = currentQuiz.questions.filter(q => q.status === 'incorrect').length;
    const total = currentQuiz.questions.length;
    const percentage = total > 0 ? (correct / total) * 100 : 0;

    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          quiz_id: currentQuiz.id,
          correct_answers: correct,
          wrong_answers: incorrect,
          total_questions: total,
          percentage: percentage,
        });

      if (error) throw error;

      toast({
        title: "Resultados salvos!",
        description: `${percentage.toFixed(1)}% de aproveitamento`,
      });

    } catch (error: any) {
      toast({
        title: "Erro ao salvar resultados",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setUserAnswers([]);
  };

  const getResults = () => {
    if (!currentQuiz) return { correct: 0, incorrect: 0, unanswered: 0, total: 0 };
    
    const correct = currentQuiz.questions.filter(q => q.status === 'correct').length;
    const incorrect = currentQuiz.questions.filter(q => q.status === 'incorrect').length;
    const unanswered = currentQuiz.questions.filter(q => q.status === 'unanswered').length;
    const total = currentQuiz.questions.length;

    return { correct, incorrect, unanswered, total };
  };

  return {
    currentQuiz,
    loading,
    quizHistory,
    allResults,
    createQuiz,
    updateAnswer,
    saveResults,
    resetQuiz,
    getResults,
    fetchQuizHistory,
    fetchAllResults,
    deleteQuizHistory,
  };
};
