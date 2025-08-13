import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useState } from 'react';

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  creator_id: string;
  is_public: boolean;
  created_at: string;
  questions: Question[];
  pdf_name?: string;
  caderno_id?: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_number: number;
  text: string | null;
  correct_answer: string | null;
  status: 'correct' | 'incorrect' | 'unanswered';
  legend?: 'circle' | 'star' | 'question' | 'exclamation' | null;
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
    caderno_id?: string;
    cadernos?: {
      nome: string;
    };
  };
  profiles?: {
    name: string;
  };
  legendStats?: {
    star: {
      total: number;
      wrong: number;
    };
    question: {
      total: number;
      correct: number;
    };
    circle: {
      total: number;
    };
  };
}

export const useQuiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [allResults, setAllResults] = useState<QuizResult[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentResults, setCurrentResults] = useState({
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    total: 0
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchQuizHistory = useCallback(async (forceRefresh = false) => {
    if (!user || loading) {
      console.log('🚫 [fetchQuizHistory] Chamada bloqueada:', { user: !!user, loading });
      return; // Evita chamadas duplicadas
    }
    
    // Debounce simples para evitar chamadas muito frequentes (apenas se não for forceRefresh)
    if (quizHistory.length > 0 && !forceRefresh) {
      console.log('📊 [fetchQuizHistory] Dados já carregados, pulando busca');
      return; // Já temos dados, não precisa buscar novamente
    }
    
    console.log('🔄 [fetchQuizHistory] Iniciando busca de dados...', { forceRefresh });
    setLoading(true);
    try {
      
      const { data, error } = await supabase
        .from('quiz_results')
        .select(`
          id,
          user_id,
          quiz_id,
          correct_answers,
          wrong_answers,
          total_questions,
          completed_at,
          quiz:quizzes (
            title,
            description,
            caderno_id
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      
      // Processar os resultados sem fazer queries adicionais
      const resultsWithStats = data?.map((result) => {
        // Calcular percentage baseado em correct_answers vs total_questions
        const percentage = result.total_questions > 0 
          ? (result.correct_answers / result.total_questions) * 100 
          : 0;
        
        const processedResult = {
          ...result,
          percentage: Math.round(percentage * 10) / 10, // Arredondar para 1 casa decimal
          quiz: {
            title: result.quiz?.title || '',
            description: result.quiz?.description || null,
            caderno_id: result.quiz?.caderno_id || null,
          },
          legendStats: {
            star: { total: 0, wrong: 0 },
            question: { total: 0, correct: 0 },
            circle: { total: 0 },
          },
        };
        
        return processedResult;
      }) || [];

      setQuizHistory(resultsWithStats as QuizResult[]);
      console.log('✅ [fetchQuizHistory] Dados carregados com sucesso:', resultsWithStats.length, 'quizzes');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ [fetchQuizHistory] Erro:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('🏁 [fetchQuizHistory] Busca finalizada');
    }
  }, [user, toast, loading, quizHistory.length]);

  const fetchAllResults = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select(`
          *,
          quiz:quizzes (
            title,
            description
          ),
          profiles(name)
        `)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      
      // Garantir que os dados retornados correspondam ao tipo QuizResult
      const typedData = data?.map(result => ({
        ...result,
        quiz: {
          title: result.quiz?.title || '',
          description: result.quiz?.description || null,
          pdf_name: null, // Campo não existe mais na tabela
        },
        profiles: {
          name: result.profiles?.name || ''
        }
      })) as QuizResult[];

      setAllResults(typedData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro ao carregar resultados",
        description: errorMessage,
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
      
      // Primeiro, verifica se o resultado existe e pertence ao usuário
      const { data: existingResult, error: checkError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('id', resultId)
        .eq('user_id', user.id)
        .single();


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

  const createQuiz = async (title: string, questionCount: number, pdfName: string, description: string, cadernoId: string) => {
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
          caderno_id: cadernoId,
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
          legend: null,
        })),
      };

      setCurrentQuiz(quizWithQuestions);
      toast({
        title: "Quiz criado!",
        description: `${questionCount} questões prontas para serem respondidas.`,
      });

      return quizWithQuestions;
    } catch (error: any) {
      console.error('❌ [createQuiz] Erro ao criar quiz:', error);
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

  const updateAnswer = async (questionId: string, status: 'correct' | 'incorrect' | 'unanswered', legend?: 'circle' | 'star' | 'question' | 'exclamation' | null) => {
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
              legend: legend || null,
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
            q.id === questionId ? { ...q, status, legend } : q
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
      const { data: newResult, error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          quiz_id: currentQuiz.id,
          correct_answers: correct,
          wrong_answers: incorrect,
          total_questions: total,
          percentage: percentage,
        })
        .select(`
          id,
          user_id,
          quiz_id,
          correct_answers,
          wrong_answers,
          total_questions,
          completed_at,
          quiz:quizzes (
            title,
            description,
            caderno_id
          )
        `)
        .single();

      if (error) throw error;

      // Atualizar o estado local com o novo resultado
      if (newResult) {
        const processedResult = {
          ...newResult,
          percentage: Math.round(percentage * 10) / 10,
          quiz: {
            title: newResult.quiz?.title || '',
            description: newResult.quiz?.description || null,
            caderno_id: newResult.quiz?.caderno_id || null,
          },
          legendStats: {
            star: { total: 0, wrong: 0 },
            question: { total: 0, correct: 0 },
            circle: { total: 0 },
          },
        };

        setQuizHistory(prev => [processedResult, ...prev]);
      }

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

  const calculateCurrentResults = (questions: Question[]) => {
    const results = {
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      total: questions.length
    };

    questions.forEach(question => {
      switch (question.status) {
        case 'correct':
          results.correct++;
          break;
        case 'incorrect':
          results.incorrect++;
          break;
        default:
          results.unanswered++;
      }
    });

    setCurrentResults(results);
    return results;
  };

  const fetchQuizQuestions = async (quizId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Primeiro, buscar o quiz_result para obter o quiz_id correto
      const { data: quizResult, error: quizResultError } = await supabase
        .from('quiz_results')
        .select('quiz_id')
        .eq('id', quizId)
        .single();

      if (quizResultError) throw quizResultError;

      if (!quizResult?.quiz_id) {
        throw new Error('Quiz não encontrado');
      }

      // Buscar questões do quiz
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizResult.quiz_id)
        .order('question_number');

      if (questionsError) throw questionsError;

      // Buscar respostas do usuário
      const { data: userAnswersData, error: userAnswersError } = await supabase
        .from('user_answers')
        .select('*')
        .eq('user_id', user.id)
        .in('question_id', questionsData?.map(q => q.id) || []);

      if (userAnswersError) throw userAnswersError;

      // Mapear as questões com o status baseado nas respostas do usuário
      const questionsWithStatus = questionsData?.map(question => {
        const userAnswer = userAnswersData?.find(a => a.question_id === question.id);
        return {
          ...question,
          status: userAnswer ? (userAnswer.is_correct ? 'correct' : 'incorrect') : 'unanswered' as const,
          legend: userAnswer?.legend || null,
        };
      }) || [];

      setQuizQuestions(questionsWithStatus as Question[]);
      calculateCurrentResults(questionsWithStatus as Question[]);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao buscar questões:', errorMessage);
      toast({
        title: "Erro ao carregar questões",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuestionStatus = async (quizId: string, questionId: string, status: 'correct' | 'incorrect' | 'unanswered', legend?: 'circle' | 'star' | 'question' | 'exclamation' | null) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Primeiro, buscar o quiz_result para obter o quiz_id correto
      const { data: quizResult, error: quizResultError } = await supabase
        .from('quiz_results')
        .select('quiz_id')
        .eq('id', quizId)
        .single();

      if (quizResultError) throw quizResultError;

      if (!quizResult?.quiz_id) {
        throw new Error('Quiz não encontrado');
      }

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
          .upsert(
            {
              user_id: user.id,
              question_id: questionId,
              user_answer: status,
              is_correct: status === 'correct',
              legend: legend || null,
            },
            {
              onConflict: 'user_id,question_id',
              ignoreDuplicates: false
            }
          );

        if (error) throw error;
      }

      // Buscar todas as respostas do usuário para este quiz
      const { data: userAnswers, error: userAnswersError } = await supabase
        .from('user_answers')
        .select('*')
        .eq('user_id', user.id)
        .in('question_id', (await supabase
          .from('questions')
          .select('id')
          .eq('quiz_id', quizResult.quiz_id)
        ).data?.map(q => q.id) || []);

      if (userAnswersError) throw userAnswersError;

      // Calcular novos totais
      const correctAnswers = userAnswers?.filter(a => a.is_correct).length || 0;
      const wrongAnswers = userAnswers?.filter(a => !a.is_correct).length || 0;
      const totalQuestions = (await supabase
        .from('questions')
        .select('id', { count: 'exact' })
        .eq('quiz_id', quizResult.quiz_id)
      ).count || 0;

      // Atualizar quiz_results
      const { error: updateError } = await supabase
        .from('quiz_results')
        .update({
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          total_questions: totalQuestions,
          percentage: totalQuestions > 0 ? ((correctAnswers + wrongAnswers) / totalQuestions) * 100 : 0
        })
        .eq('id', quizId);

      if (updateError) throw updateError;

      // Atualizar as questões locais
      await fetchQuizQuestions(quizId);
      
      // Recalcular estatísticas do quiz
      await fetchQuizHistory();

      // Atualizar resultados atuais
      if (quizQuestions.length > 0) {
        calculateCurrentResults(quizQuestions);
      }

      toast({
        title: "Questão atualizada",
        description: "As alterações foram salvas com sucesso.",
      });

    } catch (error: any) {
      toast({
        title: "Erro ao atualizar questão",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    currentQuiz,
    loading,
    quizHistory,
    allResults,
    quizQuestions,
    currentResults,
    createQuiz,
    updateAnswer,
    saveResults,
    resetQuiz,
    getResults,
    fetchQuizHistory,
    fetchAllResults,
    deleteQuizHistory,
    fetchQuizQuestions,
    updateQuestionStatus,
  };
};
