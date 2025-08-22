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
import { useQuiz } from '@/hooks/useQuiz';
import { Tag, useTags } from '@/hooks/useTags';
import { ArrowLeft, Calendar, Edit2, Eye, Filter, History, Target, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { QuestionCard } from './QuestionCard';

interface QuizHistoryProps {
  onBack: () => void;
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
    currentResults 
  } = useQuiz();
  
  const { cadernos } = useCadernos();
  const { tags, getQuizTags } = useTags();
  
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [selectedCadernoFilter, setSelectedCadernoFilter] = useState<string>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [quizTags, setQuizTags] = useState<{ [quizId: string]: Tag[] }>({});

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  useEffect(() => {
    if (quizHistory.length > 0) {
      loadQuizTags();
    }
  }, [quizHistory]);

  const loadQuizTags = async () => {
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
  };

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

  // Filtrar quizzes baseado nos filtros selecionados
  const filteredQuizHistory = quizHistory.filter(quiz => {
    const cadernoMatch = selectedCadernoFilter === 'all' || quiz.quiz?.caderno_id === selectedCadernoFilter;
    const tagMatch = selectedTagFilter === 'all' || 
      (quizTags[quiz.quiz_id] && quizTags[quiz.quiz_id].some(tag => tag.id === selectedTagFilter));
    
    return cadernoMatch && tagMatch;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 ps-4 pt-4">
          <Button variant="outline" onClick={onBack} className="p-2 px-3 rounded-full">
            {/* back button */}
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Histórico de Quizzes</h1>
            <p className="text-muted-foreground">Acompanhe seu progresso e performance</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-4">
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
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Lista de Quizzes */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando histórico...</p>
        </div>
      ) : filteredQuizHistory.length === 0 ? (
        <Card className="p-8 text-center">
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
            <Card key={result.id} className="p-4">
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
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold text-foreground">Questões do Quiz</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
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
    </div>
  );
};
