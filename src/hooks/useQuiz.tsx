
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  creator_id: string;
  is_public: boolean;
  created_at: string;
  questions: Question[];
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

export const useQuiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createQuiz = async (title: string, questionCount: number) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          title,
          description: `Quiz com ${questionCount} questões`,
          creator_id: user.id,
          is_public: true,
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
        // Upsert answer
        const { error } = await supabase
          .from('user_answers')
          .upsert({
            user_id: user.id,
            question_id: questionId,
            user_answer: status,
            is_correct: status === 'correct',
          });

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
    createQuiz,
    updateAnswer,
    saveResults,
    resetQuiz,
    getResults,
  };
};
