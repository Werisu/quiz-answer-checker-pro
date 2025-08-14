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
import { Calendar, Circle, Edit2, Eye, Filter, HelpCircle, History, Star, Target, Trash2, TrendingUp, X } from 'lucide-react';
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
  const [selectedCadernoFilter, setSelectedCadernoFilter] = useState<string>('all');

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  useEffect(() => {
    if (selectedQuizId) {
      fetchQuizQuestions(selectedQuizId);
    }
  }, [selectedQuizId]);

  // Filtrar quizzes baseado no caderno selecionado
  const filteredQuizHistory = selectedCadernoFilter === 'all'
    ? quizHistory
    : quizHistory.filter(result => result.quiz?.caderno_id === selectedCadernoFilter);

  // Obter nome do caderno filtrado
  const getCadernoName = (cadernoId: string) => {
    return cadernos.find(c => c.id === cadernoId)?.nome || 'Caderno não encontrado';
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) {
      return <Badge className="bg-gradient-to-r from-green-500/10 to-green-600/20 text-green-800 border-green-300 rounded-xl px-3 py-1 text-xs font-medium dark:from-green-500/20 dark:to-green-600/30 dark:border-green-400/40 dark:text-green-200 dark:bg-green-500/20">Excelente</Badge>;
    } else if (percentage >= 60) {
      return <Badge className="bg-gradient-to-r from-yellow-500/10 to-amber-600/20 text-yellow-800 border-yellow-300 rounded-xl px-3 py-1 text-xs font-medium dark:from-yellow-500/20 dark:to-amber-600/30 dark:border-yellow-400/40 dark:text-yellow-200 dark:bg-yellow-500/20">Bom</Badge>;
    } else {
      return <Badge className="bg-gradient-to-r from-red-500/10 to-rose-600/20 text-red-800 border-red-300 rounded-xl px-3 py-1 text-xs font-medium dark:from-red-500/20 dark:to-rose-600/30 dark:border-red-400/40 dark:text-red-200 dark:bg-red-500/20">Precisa Melhorar</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">Carregando histórico...</p>
      </div>
    );
  }

  const selectedQuiz = quizHistory.find(q => q.id === selectedQuizId);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-white via-gray-50/50 to-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl dark:from-slate-800/80 dark:via-slate-700/60 dark:to-slate-800/80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Histórico de Quizzes</h2>
          </div>
          <Button variant="outline" onClick={onBack} className="bg-gradient-to-r from-white/80 to-white/60 border-slate-200/50 text-slate-700 hover:from-white hover:to-white hover:border-slate-300/70 hover:text-slate-800 shadow-sm dark:from-slate-700/80 dark:to-slate-600/60 dark:border-slate-500/40 dark:text-slate-200 dark:hover:from-slate-600/80 dark:hover:to-slate-500/60 dark:hover:border-slate-400/50 dark:hover:text-slate-100">
            Voltar
          </Button>
        </div>

        {/* Filtro por Caderno */}
        <div className="mb-6 p-4 bg-gradient-to-r from-slate-500/10 to-blue-500/10 rounded-lg border border-slate-200/50 dark:from-slate-500/20 dark:to-blue-500/20 dark:border-slate-600/40">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Caderno:</span>
            <Select value={selectedCadernoFilter} onValueChange={setSelectedCadernoFilter}>
              <SelectTrigger className="w-64 bg-gradient-to-r from-white/80 to-white/60 border-slate-200/50 dark:from-slate-700/80 dark:to-slate-600/60 dark:border-slate-500/40">
                <SelectValue placeholder="Todos os cadernos" />
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
            {selectedCadernoFilter !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCadernoFilter('all')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {selectedCadernoFilter !== 'all' && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Mostrando quizzes do caderno: <span className="font-medium text-blue-600 dark:text-blue-400">{getCadernoName(selectedCadernoFilter)}</span>
              {' '}({filteredQuizHistory.length} de {quizHistory.length} quizzes)
            </div>
          )}
        </div>

        {quizHistory.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Nenhum quiz realizado ainda
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Complete alguns quizzes para ver seu histórico aqui
            </p>
          </div>
        ) : filteredQuizHistory.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Nenhum quiz encontrado para o caderno selecionado
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Tente selecionar outro caderno ou remover o filtro
            </p>
            <Button
              variant="outline"
              onClick={() => setSelectedCadernoFilter('all')}
              className="mt-3 bg-gradient-to-r from-white/80 to-white/60 border-slate-200/50 text-slate-700 hover:from-white hover:to-white hover:border-slate-300/70 hover:text-slate-800 shadow-sm dark:from-slate-700/80 dark:to-slate-600/60 dark:border-slate-500/40 dark:text-slate-200 dark:hover:from-slate-600/80 dark:hover:to-slate-500/60 dark:hover:border-slate-400/50 dark:hover:text-slate-100"
            >
              Remover Filtro
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuizHistory.map((result) => (
              <Card key={result.id} className="p-4 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm border border-slate-200/30 dark:from-slate-700/60 dark:to-slate-600/40 dark:border-slate-600/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      {result.quiz?.title || 'Quiz'}
                    </h3>
                    <div className="space-y-1 mb-2">
                      {result.quiz?.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {result.quiz.description}
                        </p>
                      )}
                      {result.quiz?.cadernos?.nome && (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-500/10 to-blue-600/20 text-blue-700 border-blue-200 dark:from-blue-500/20 dark:to-blue-600/30 dark:border-blue-400/40 dark:text-blue-200 dark:bg-blue-500/20">
                            {result.quiz.cadernos.nome}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                            <span className="text-gray-600 dark:text-gray-400">{currentResults.correct}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-gray-600 dark:text-gray-400">{currentResults.incorrect}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-500"></div>
                            <span className="text-gray-600 dark:text-gray-400">{currentResults.unanswered}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {((currentResults.correct + currentResults.incorrect) / currentResults.total * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {result.correct_answers} acertos
                        </span>
                        {' • '}
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {result.wrong_answers} erros
                        </span>
                        {' • '}
                        <span className={`font-medium ${result.correct_answers - result.wrong_answers >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {result.correct_answers - result.wrong_answers} pontos líquidos
                        </span>
                      </div>
                      <div className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {result.percentage.toFixed(1)}%
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {getPerformanceBadge(result.percentage)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-500/20"
                        onClick={() => setSelectedQuizId(result.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:text-gray-400 dark:hover:text-yellow-400 dark:hover:bg-yellow-500/20"
                        onClick={() => setEditingQuestionId(result.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/20"
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
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">Questões do Quiz</h4>
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
                          variant={editingQuestionId === selectedQuizId ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (editingQuestionId === selectedQuizId) {
                              setEditingQuestionId(null);
                            } else {
                              setEditingQuestionId(selectedQuizId);
                            }
                          }}
                          className={editingQuestionId === selectedQuizId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gradient-to-r from-white/80 to-white/60 border-slate-200/50 text-slate-700 hover:from-white hover:to-white hover:border-slate-300/70 hover:text-slate-800 shadow-sm dark:from-slate-700/80 dark:to-slate-600/60 dark:border-slate-500/40 dark:text-slate-200 dark:hover:from-slate-600/80 dark:hover:to-slate-500/60 dark:hover:border-slate-400/50 dark:hover:text-slate-100"}
                        >
                          {editingQuestionId === selectedQuizId ? "Cancelar Edição" : "Editar Questões"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedQuizId(null);
                            setEditingQuestionId(null);
                          }}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          Fechar
                        </Button>
                      </div>
                    </div>
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg mb-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Carregando questões...</p>
                      </div>
                    ) : !quizQuestions || quizQuestions.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Nenhuma questão encontrada</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gradient-to-r from-yellow-500/10 to-amber-600/20 p-4 rounded-lg border border-yellow-200/50 dark:from-yellow-500/20 dark:to-amber-600/30 dark:border-yellow-600/40">
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                              <h5 className="font-semibold text-yellow-800 dark:text-yellow-200">Questões com Certeza</h5>
                            </div>
                            <div className="text-sm">
                              <p className="text-yellow-700 dark:text-yellow-300">
                                Total: {result.legendStats?.star?.total || 0} questões
                              </p>
                              <p className="text-red-600 dark:text-red-400">
                                Erradas: {result.legendStats?.star?.wrong || 0} questões
                              </p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-600/20 p-4 rounded-lg border border-blue-200/50 dark:from-blue-500/20 dark:to-indigo-600/30 dark:border-blue-600/40">
                            <div className="flex items-center gap-2 mb-2">
                              <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <h5 className="font-semibold text-blue-800 dark:text-blue-200">Questões em Dúvida</h5>
                            </div>
                            <div className="text-sm">
                              <p className="text-blue-700 dark:text-blue-300">
                                Total: {result.legendStats?.question?.total || 0} questões
                              </p>
                              <p className="text-green-600 dark:text-green-400">
                                Acertadas: {result.legendStats?.question?.correct || 0} questões
                              </p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-gray-500/10 to-slate-600/20 p-4 rounded-lg border border-gray-200/50 dark:from-gray-500/20 dark:to-slate-600/30 dark:border-gray-600/40">
                            <div className="flex items-center gap-2 mb-2">
                              <Circle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              <h5 className="font-semibold text-gray-800 dark:text-gray-200">Questões sem Conhecimento</h5>
                            </div>
                            <div className="text-sm">
                              <p className="text-gray-700 dark:text-gray-300">
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
                              isEditing={true}
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
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-600/20 rounded-lg border border-blue-200/50 dark:from-blue-500/20 dark:to-indigo-600/30 dark:border-blue-600/40">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                    {selectedCadernoFilter === 'all' ? 'Estatísticas Gerais' : 'Estatísticas do Caderno Selecionado'}
                  </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total de Quizzes:</span>
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      {filteredQuizHistory.length}
                      {selectedCadernoFilter !== 'all' && ` / ${quizHistory.length}`}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Média de Acertos:</span>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {filteredQuizHistory.length > 0 
                        ? (filteredQuizHistory.reduce((acc, r) => acc + r.percentage, 0) / filteredQuizHistory.length).toFixed(1)
                        : '0.0'
                      }%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Melhor Resultado:</span>
                    <div className="font-semibold text-blue-600 dark:text-blue-400">
                      {filteredQuizHistory.length > 0 
                        ? Math.max(...filteredQuizHistory.map(r => r.percentage)).toFixed(1)
                        : '0.0'
                      }%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total de Questões:</span>
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      {filteredQuizHistory.reduce((acc, r) => acc + r.total_questions, 0)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total de Pontos Líquidos:</span>
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
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
