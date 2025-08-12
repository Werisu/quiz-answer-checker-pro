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
import { useQuiz } from '@/hooks/useQuiz';
import { useCadernos } from '@/hooks/useCadernos';
import { Calendar, Circle, Edit2, Eye, HelpCircle, History, Star, Target, Trash2, TrendingUp, Filter, X } from 'lucide-react';
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
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [selectedCadernoFilter, setSelectedCadernoFilter] = useState<string>('');

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  useEffect(() => {
    if (selectedQuizId) {
      console.log('Buscando questões para o quiz:', selectedQuizId);
      fetchQuizQuestions(selectedQuizId);
    }
  }, [selectedQuizId]);

  // Filtrar quizzes baseado no caderno selecionado
  const filteredQuizHistory = selectedCadernoFilter
    ? quizHistory.filter(result => result.quiz?.caderno_id === selectedCadernoFilter)
    : quizHistory;

  // Obter nome do caderno filtrado
  const getCadernoName = (cadernoId: string) => {
    return cadernos.find(c => c.id === cadernoId)?.nome || 'Caderno não encontrado';
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) {
      return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    } else if (percentage >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">Bom</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Precisa Melhorar</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando histórico...</p>
      </div>
    );
  }

  const selectedQuiz = quizHistory.find(q => q.id === selectedQuizId);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Histórico de Quizzes</h2>
          </div>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>

        {/* Filtro por Caderno */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtrar por Caderno:</span>
            <Select value={selectedCadernoFilter} onValueChange={setSelectedCadernoFilter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Todos os cadernos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os cadernos</SelectItem>
                {cadernos.map((caderno) => (
                  <SelectItem key={caderno.id} value={caderno.id}>
                    {caderno.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCadernoFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCadernoFilter('')}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {selectedCadernoFilter && (
            <div className="mt-2 text-sm text-gray-600">
              Mostrando quizzes do caderno: <span className="font-medium text-blue-600">{getCadernoName(selectedCadernoFilter)}</span>
              {' '}({filteredQuizHistory.length} de {quizHistory.length} quizzes)
            </div>
          )}
        </div>

        {quizHistory.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhum quiz realizado ainda
            </h3>
            <p className="text-gray-500">
              Complete alguns quizzes para ver seu histórico aqui
            </p>
          </div>
        ) : filteredQuizHistory.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhum quiz encontrado para o caderno selecionado
            </h3>
            <p className="text-gray-500">
              Tente selecionar outro caderno ou remover o filtro
            </p>
            <Button
              variant="outline"
              onClick={() => setSelectedCadernoFilter('')}
              className="mt-3"
            >
              Remover Filtro
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuizHistory.map((result) => (
              <Card key={result.id} className="p-4 bg-white/60 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {result.quiz?.title || 'Quiz'}
                    </h3>
                    <div className="space-y-1 mb-2">
                      {result.quiz?.description && (
                        <p className="text-sm text-gray-600">
                          {result.quiz.description}
                        </p>
                      )}
                      {result.quiz?.cadernos?.nome && (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {result.quiz.cadernos.nome}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(result.completed_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      {selectedQuizId === result.id && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">{currentResults.correct}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-gray-600">{currentResults.incorrect}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                            <span className="text-gray-600">{currentResults.unanswered}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {((currentResults.correct + currentResults.incorrect) / currentResults.total * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-green-600 font-medium">
                          {result.correct_answers} acertos
                        </span>
                        {' • '}
                        <span className="text-red-600 font-medium">
                          {result.wrong_answers} erros
                        </span>
                        {' • '}
                        <span className={`font-medium ${result.correct_answers - result.wrong_answers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.correct_answers - result.wrong_answers} pontos líquidos
                        </span>
                      </div>
                      <div className="text-xl font-bold text-gray-800">
                        {result.percentage.toFixed(1)}%
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {getPerformanceBadge(result.percentage)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => setSelectedQuizId(result.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50"
                        onClick={() => setEditingQuestionId(result.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Quiz do Histórico</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover este quiz do seu histórico? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteQuizHistory(result.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>

                {selectedQuizId === result.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">Questões do Quiz</h4>
                      <div className="flex items-center gap-2">
                        {editingQuestionId === selectedQuizId && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setEditingQuestionId(null);
                              fetchQuizHistory();
                            }}
                          >
                            Salvar Alterações
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedQuizId(null);
                            setEditingQuestionId(null);
                          }}
                        >
                          Fechar
                        </Button>
                      </div>
                    </div>
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Carregando questões...</p>
                      </div>
                    ) : !quizQuestions || quizQuestions.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600">Nenhuma questão encontrada</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="w-5 h-5 text-yellow-600" />
                              <h5 className="font-semibold text-yellow-800">Questões com Certeza</h5>
                            </div>
                            <div className="text-sm">
                              <p className="text-yellow-700">
                                Total: {result.legendStats?.star?.total || 0} questões
                              </p>
                              <p className="text-red-600">
                                Erradas: {result.legendStats?.star?.wrong || 0} questões
                              </p>
                            </div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <HelpCircle className="w-5 h-5 text-blue-600" />
                              <h5 className="font-semibold text-blue-800">Questões em Dúvida</h5>
                            </div>
                            <div className="text-sm">
                              <p className="text-blue-700">
                                Total: {result.legendStats?.question?.total || 0} questões
                              </p>
                              <p className="text-green-600">
                                Acertadas: {result.legendStats?.question?.correct || 0} questões
                              </p>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Circle className="w-5 h-5 text-gray-600" />
                              <h5 className="font-semibold text-gray-800">Questões sem Conhecimento</h5>
                            </div>
                            <div className="text-sm">
                              <p className="text-gray-700">
                                Total: {result.legendStats?.circle?.total || 0} questões
                              </p>
                            </div>
                          </div>
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
                              isEditing={editingQuestionId === selectedQuizId}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card>
            ))}
            
            {quizHistory.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">
                    {selectedCadernoFilter ? 'Estatísticas do Caderno Selecionado' : 'Estatísticas Gerais'}
                  </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total de Quizzes:</span>
                    <div className="font-semibold text-gray-800">
                      {filteredQuizHistory.length}
                      {selectedCadernoFilter && ` / ${quizHistory.length}`}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Média de Acertos:</span>
                    <div className="font-semibold text-green-600">
                      {filteredQuizHistory.length > 0 
                        ? (filteredQuizHistory.reduce((acc, r) => acc + r.percentage, 0) / filteredQuizHistory.length).toFixed(1)
                        : '0.0'
                      }%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Melhor Resultado:</span>
                    <div className="font-semibold text-blue-600">
                      {filteredQuizHistory.length > 0 
                        ? Math.max(...filteredQuizHistory.map(r => r.percentage)).toFixed(1)
                        : '0.0'
                      }%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total de Questões:</span>
                    <div className="font-semibold text-gray-800">
                      {filteredQuizHistory.reduce((acc, r) => acc + r.total_questions, 0)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total de Pontos Líquidos:</span>
                    <div className="font-semibold text-gray-800">
                      {filteredQuizHistory.reduce((acc, r) => acc + (r.correct_answers - r.wrong_answers), 0)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
