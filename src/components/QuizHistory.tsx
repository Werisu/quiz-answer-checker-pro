import { TagDisplay } from '@/components/TagDisplay';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCadernos } from '@/hooks/useCadernos';
import { QuizResult, useQuiz } from '@/hooks/useQuiz';
import { Tag, useTags } from '@/hooks/useTags';
import { AlertCircle, ArrowLeft, BookOpen, Calendar, Edit2, Eye, Filter, History, Target, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { QuestionCard } from './QuestionCard';

interface QuizHistoryProps {
  onBack: () => void;
}

interface TagType {
  id: string;
  name: string;
  color: string;
}

// Type guard para verificar se o objeto tem as propriedades necessárias
const isTagType = (obj: unknown): obj is TagType => {
  if (obj === null || typeof obj !== 'object') return false;
  const objRecord = obj as Record<string, unknown>;
  return typeof objRecord.id === 'string' && 
         typeof objRecord.name === 'string' && 
         typeof objRecord.color === 'string';
};

interface QuizWithConfig {
  title: string;
  description: string;
  caderno_id?: string;
  question_config?: {
    sequence_type: 'normal' | 'odd' | 'even';
    start_number: number;
  };
}

export const QuizHistory: React.FC<QuizHistoryProps> = ({ onBack }) => {
  const { 
    quizHistory, 
    fetchQuizHistory, 
    loading, 
    deleteQuizHistory, 
    quizQuestions, 
    fetchQuizQuestions, 
    updateQuestionStatus,
    currentResults,
    fetchPendingReviewResults,
    markResultAsReviewed
  } = useQuiz();
  
  const { cadernos } = useCadernos();
  const { tags, getQuizTags } = useTags();
  
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [selectedCadernoFilter, setSelectedCadernoFilter] = useState<string>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [quizTags, setQuizTags] = useState<{ [quizId: string]: Tag[] }>({});
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [pendingResults, setPendingResults] = useState<QuizResult[]>([]);
  const [reviewedResults, setReviewedResults] = useState<QuizResult[]>([]);

  const loadReviewResults = useCallback(async () => {
    const pending = await fetchPendingReviewResults();
    setPendingResults(pending);
    
    // Buscar gabaritos já revisados do histórico
    const allHistory = quizHistory.filter(h => 
      pending.some(p => p.id === h.id)
    );
    const reviewed = allHistory.filter(h => h.reviewed_at) as QuizResult[];
    setReviewedResults(reviewed);
  }, [fetchPendingReviewResults, quizHistory]);

  useEffect(() => {
    fetchQuizHistory();
  }, [fetchQuizHistory]);

  useEffect(() => {
    if (isReviewMode) {
      loadReviewResults();
    }
  }, [isReviewMode, loadReviewResults]);

  const handleMarkAsReviewed = useCallback(async (resultId: string) => {
    const success = await markResultAsReviewed(resultId);
    if (success) {
      await loadReviewResults();
      await fetchQuizHistory();
    }
  }, [markResultAsReviewed, loadReviewResults, fetchQuizHistory]);

  const loadQuizTags = useCallback(async () => {
    const tagsMap: { [quizId: string]: Tag[] } = {};
    
    for (const quiz of quizHistory) {
      try {
        const quizTags = await getQuizTags(quiz.quiz_id);
        tagsMap[quiz.quiz_id] = quizTags;
      } catch (error) {
        console.error(`Erro ao carregar tags do quiz ${quiz.quiz_id}:`, error);
        tagsMap[quiz.quiz_id] = [];
      }
    }
    
    setQuizTags(tagsMap);
  }, [quizHistory, getQuizTags]);

  useEffect(() => {
    if (quizHistory.length > 0) {
      loadQuizTags();
    }
  }, [quizHistory, loadQuizTags]);

  const handleViewQuestions = async (quizId: string) => {
    if (selectedQuizId === quizId) {
      setSelectedQuizId(null);
    } else {
      setSelectedQuizId(quizId);
      await fetchQuizQuestions(quizId);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await deleteQuizHistory(quizId);
      fetchQuizHistory();
    } catch (error) {
      console.error('Erro ao deletar quiz:', error);
    }
  };

  const getCadernoName = (cadernoId: string | undefined) => {
    if (!cadernoId) return 'Sem caderno';
    const caderno = cadernos.find(c => c.id === cadernoId);
    return caderno ? caderno.nome : 'Caderno não encontrado';
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '👍';
    if (percentage >= 50) return '📚';
    return '💪';
  };

  const getQuestionConfigDisplay = (quiz: QuizWithConfig) => {
    if (!quiz?.question_config) return null;
    
    const { sequence_type, start_number } = quiz.question_config;
    
    let configText = '';
    if (sequence_type === 'normal') {
      configText = `Sequência normal (${start_number}, ${start_number + 1}, ${start_number + 2}...)`;
    } else if (sequence_type === 'odd') {
      configText = `Questões ímpares (${start_number}, ${start_number + 2}, ${start_number + 4}...)`;
    } else if (sequence_type === 'even') {
      configText = `Questões pares (${start_number}, ${start_number + 2}, ${start_number + 4}...)`;
    }
    
    return configText;
  };

  // Filtrar quizzes baseado nos filtros selecionados
  const filteredQuizHistory = quizHistory.filter(quiz => {
    const cadernoMatch = selectedCadernoFilter === 'all' || quiz.quiz?.caderno_id === selectedCadernoFilter;
    const tagMatch = selectedTagFilter === 'all' || 
      (quizTags[quiz.quiz_id] && quizTags[quiz.quiz_id].some(tag => tag.id === selectedTagFilter));
    
    return cadernoMatch && tagMatch;
  });

  const handleReviewModeToggle = () => {
    setIsReviewMode(!isReviewMode);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };


  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack} className="p-2 px-3 rounded-full">
            {/* back button */}
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isReviewMode ? 'Revisão de Questões' : 'Histórico de Quizzes'}
            </h1>
            <p className="text-muted-foreground">
              {isReviewMode 
                ? 'Revise questões que precisam de atenção' 
                : 'Acompanhe seu progresso e performance'}
            </p>
          </div>
        </div>
        <div>
          <Button
            variant={isReviewMode ? "default" : "outline"}
            onClick={handleReviewModeToggle}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            {isReviewMode ? 'Voltar ao Histórico' : 'Revisar Questões'}
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {!isReviewMode && (
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filtros:</span>
            </div>
            
            <Select value={selectedCadernoFilter} onValueChange={setSelectedCadernoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por caderno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cadernos</SelectItem>
                {cadernos.map((caderno) => (
                  <SelectItem key={caderno.id} value={caderno.id}>
                    {caderno.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTagFilter} onValueChange={setSelectedTagFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tags</SelectItem>
                {tags.map((tag) => {
                  if (!isTagType(tag)) return null;
                  return (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {/* Conteúdo: Revisão ou Histórico */}
      {isReviewMode ? (
        <>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando gabaritos...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Gabaritos Pendentes */}
              {pendingResults.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Pendentes de Revisão ({pendingResults.length})
                  </h2>
                  <div className="space-y-3">
                    {pendingResults.map((result) => (
                      <Card key={result.id} className="p-5 sm:p-6 border-orange-200 dark:border-orange-800">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-base font-semibold text-foreground">
                                Gabarito {formatDate(result.completed_at)}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {result.quiz?.title || 'Quiz sem título'}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                {result.correct_answers} corretas / {result.wrong_answers} incorretas
                              </span>
                              <span className={`font-semibold ${getPerformanceColor(result.percentage)}`}>
                                {result.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewQuestions(result.id)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Gabarito
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleMarkAsReviewed(result.id)}
                              className="flex items-center gap-2"
                            >
                              <Target className="w-4 h-4" />
                              Marcar como Revisado
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Gabaritos Revisados */}
              {reviewedResults.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Revisados ({reviewedResults.length})
                  </h2>
                  <div className="space-y-3">
                    {reviewedResults.map((result) => (
                      <Card key={result.id} className="p-5 sm:p-6 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-base font-semibold text-foreground">
                                Gabarito {formatDate(result.completed_at)} revisado
                              </h3>
                              {result.reviewed_at && (
                                <Badge variant="secondary" className="text-xs">
                                  Revisado em {formatDate(result.reviewed_at)}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {result.quiz?.title || 'Quiz sem título'}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                {result.correct_answers} corretas / {result.wrong_answers} incorretas
                              </span>
                              <span className={`font-semibold ${getPerformanceColor(result.percentage)}`}>
                                {result.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewQuestions(result.id)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Gabarito
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensagem quando não há gabaritos */}
              {pendingResults.length === 0 && reviewedResults.length === 0 && (
                <Card className="p-8 sm:p-12 text-center">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Nenhum gabarito para revisar</h3>
                  <p className="text-muted-foreground">
                    Todos os gabaritos foram revisados ou não há gabaritos com questões que precisam de revisão.
                  </p>
                </Card>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Lista de Quizzes */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando histórico...</p>
            </div>
          ) : filteredQuizHistory.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum quiz encontrado</h3>
          <p className="text-muted-foreground">
            {selectedCadernoFilter !== 'all' || selectedTagFilter !== 'all' 
              ? 'Tente ajustar os filtros para ver mais resultados.'
              : 'Complete seu primeiro quiz para começar a acompanhar seu progresso!'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuizHistory.map((result) => (
            <Card key={result.id} className="p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Informações do Quiz */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {result.quiz?.title || 'Quiz sem título'}
                      </h3>
                      {result.quiz?.description && (
                        <p className="text-sm text-muted-foreground">{result.quiz.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getCadernoName(result.quiz?.caderno_id)}
                      </Badge>
                      <span className={`text-sm font-semibold ${getPerformanceColor(result.percentage)}`}>
                        {getPerformanceIcon(result.percentage)} {result.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Tags do Quiz */}
                  {quizTags[result.quiz_id] && quizTags[result.quiz_id].length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Tags:</span>
                      <TagDisplay tags={quizTags[result.quiz_id]} size="sm" />
                    </div>
                  )}

                  {/* Configuração de Questões */}
                  {(result.quiz as QuizWithConfig)?.question_config && (
                    <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 dark:from-indigo-950/20 dark:to-blue-950/20 dark:border-indigo-800">
                      <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Target className="w-2 h-2 text-white" />
                      </div>
                      <span className="text-xs text-foreground font-medium">
                        {getQuestionConfigDisplay(result.quiz as QuizWithConfig)}
                      </span>
                    </div>
                  )}

                  {/* Estatísticas */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-foreground">{result.correct_answers} corretas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-foreground">{result.wrong_answers} incorretas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-foreground">{result.total_questions - result.correct_answers - result.wrong_answers} não respondidas</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(result.completed_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewQuestions(result.id)}
                    className="flex items-center gap-2"
                  >
                    {selectedQuizId === result.id ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    {selectedQuizId === result.id ? 'Ocultar' : 'Ver Questões'}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteQuiz(result.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Questões do Quiz */}
              {selectedQuizId === result.id && quizQuestions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-5">
                    <Target className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold text-foreground">Questões do Quiz</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {quizQuestions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        onUpdateStatus={(questionId, status, legend) => {
                          if (selectedQuizId) {
                            updateQuestionStatus(selectedQuizId, question.id, status, legend);
                          }
                        }}
                        isEditing={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
};
