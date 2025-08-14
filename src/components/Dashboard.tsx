import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCadernos } from '@/hooks/useCadernos';
import { useGoalsAndChallenges } from '@/hooks/useGoalsAndChallenges';
import { useQuiz } from '@/hooks/useQuiz';
import {
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  HelpCircle,
  History,
  Plus,
  Settings,
  Star,
  Target,
  XCircle
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface DashboardProps {
  onBack: () => void;
  onNavigateToHistory?: () => void;
  onNavigateToStats?: () => void;
  onNavigateToGoals?: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToQuizCreator?: () => void;
  showNavigationButtons?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onBack, 
  onNavigateToHistory, 
  onNavigateToStats, 
  onNavigateToGoals, 
  onNavigateToAdmin, 
  onNavigateToQuizCreator,
  showNavigationButtons = false 
}) => {
  const { user, userProfile } = useAuth();
  const { quizHistory, fetchQuizHistory } = useQuiz();
  const { goals, challenges } = useGoalsAndChallenges();
  const { cadernos } = useCadernos();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user) {
      fetchQuizHistory();
    }
  }, [user]); // Removido fetchQuizHistory da dependência

  // Função para forçar refresh dos dados
  const refreshData = useCallback(() => {
    if (user) {
      fetchQuizHistory();
    }
  }, [user, fetchQuizHistory]);

  // Calcular estatísticas gerais
  const totalQuizzes = quizHistory?.length || 0;
  const totalQuestions = quizHistory?.reduce((sum, quiz) => sum + (quiz.total_questions || 0), 0) || 0;
  const correctAnswers = quizHistory?.reduce((sum, quiz) => sum + (quiz.correct_answers || 0), 0) || 0;
  const wrongAnswers = quizHistory?.reduce((sum, quiz) => sum + (quiz.wrong_answers || 0), 0) || 0;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  // Calcular progresso das metas
  const activeGoals = goals?.filter(g => !g.completed) || [];
  const completedGoals = goals?.filter(g => g.completed) || [];
  const goalCompletionRate = goals?.length > 0 ? (completedGoals.length / goals.length) * 100 : 0;

  // Calcular performance por caderno
  const cadernoPerformance = (cadernos || []).map(caderno => {
    const cadernoQuizzes = quizHistory?.filter(quiz => quiz.quiz?.caderno_id === caderno.id) || [];
    const cadernoQuestions = cadernoQuizzes.reduce((sum, quiz) => sum + (quiz.total_questions || 0), 0);
    const cadernoCorrect = cadernoQuizzes.reduce((sum, quiz) => sum + (quiz.correct_answers || 0), 0);
    const cadernoAccuracy = cadernoQuestions > 0 ? (cadernoCorrect / cadernoQuestions) * 100 : 0;
    
    return {
      ...caderno,
      quizzes: cadernoQuizzes.length,
      questions: cadernoQuestions,
      accuracy: cadernoAccuracy,
      correct: cadernoCorrect
    };
  }).sort((a, b) => b.accuracy - a.accuracy);

  // Calcular tendências de estudo
  const recentQuizzes = quizHistory
    ?.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    ?.slice(0, 5) || [];

  // Calcular frequência de estudo
  const studyFrequency = quizHistory?.reduce((acc, quiz) => {
    const date = new Date(quiz.completed_at).toDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const studyDays = Object.keys(studyFrequency).length;
  const averageQuizzesPerDay = studyDays > 0 ? totalQuizzes / studyDays : 0;

  // Verificar se os dados estão carregados
  if (!quizHistory || !goals || !cadernos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-background dark:via-muted/30 dark:to-background/80">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm dark:bg-background/80 dark:border-border dark:shadow-none">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack} className="bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm dark:bg-background/80 dark:border-border dark:hover:border-border">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent dark:from-foreground dark:via-foreground dark:to-foreground">
                Dashboard Personalizado
              </h1>
              <p className="text-slate-600 dark:text-muted-foreground">Acompanhe seu progresso e desempenho</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800 shadow-sm dark:bg-accent/50 dark:border-border dark:text-foreground">
              <Award className="w-4 h-4 mr-1" />
              Nível 1
            </Badge>
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800 shadow-sm dark:bg-accent/50 dark:border-border dark:text-foreground">
              <Star className="w-4 h-4 mr-1" />
              0 pts
            </Badge>
          </div>
        </div>
      </div>

      {/* Botões de Navegação Rápida */}
      {showNavigationButtons && (
        <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-sm dark:bg-background/60 dark:border-border dark:shadow-none">
          <div className="container mx-auto p-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {onNavigateToQuizCreator && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onNavigateToQuizCreator}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-sm transition-all duration-200 dark:bg-background/80 dark:border-border dark:hover:bg-accent dark:text-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Quiz
                </Button>
              )}
              {onNavigateToHistory && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onNavigateToHistory}
                  className="bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border-emerald-200 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800 shadow-sm transition-all duration-200 dark:bg-background/80 dark:border-border dark:hover:bg-accent dark:text-foreground"
                >
                  <History className="w-4 h-4 mr-2" />
                  Histórico
                </Button>
              )}
              {onNavigateToStats && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onNavigateToStats}
                  className="bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 shadow-sm transition-all duration-200 dark:bg-background/80 dark:border-border dark:hover:bg-accent dark:text-foreground"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Estatísticas
                </Button>
              )}
              {onNavigateToGoals && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onNavigateToGoals}
                  className="bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border-rose-200 hover:border-rose-300 text-rose-700 hover:text-rose-800 shadow-sm transition-all duration-200 dark:bg-background/80 dark:border-border dark:hover:bg-accent dark:text-foreground"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Metas
                </Button>
              )}
              {onNavigateToAdmin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onNavigateToAdmin}
                  className="bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-800 shadow-sm transition-all duration-200 dark:bg-background/80 dark:border-border dark:hover:bg-accent dark:text-foreground"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-lg rounded-2xl p-1 dark:bg-muted/50 dark:border-border dark:shadow-none">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-all duration-200 dark:data-[state=active]:bg-background">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-all duration-200 dark:data-[state=active]:bg-background">
              Performance
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-all duration-200 dark:data-[state=active]:bg-background">
              Metas
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-all duration-200 dark:data-[state=active]:bg-background">
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Tab: Visão Geral */}
          <TabsContent value="overview" className="space-y-8">
            {/* Cards de Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200/30 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-blue-500/20 dark:to-blue-600/30 dark:border-blue-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-blue-800 dark:text-blue-200">Total de Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalQuizzes}</div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Quizzes realizados</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/20 border-emerald-200/30 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-emerald-500/20 dark:to-emerald-600/30 dark:border-emerald-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Precisão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{accuracy.toFixed(1)}%</div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">Taxa de acerto</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/20 border-purple-200/30 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-purple-500/20 dark:to-purple-600/30 dark:border-purple-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-purple-800 dark:text-purple-200">Frequência</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{studyDays}</div>
                  <p className="text-xs text-purple-700 dark:text-purple-300">Dias de estudo</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-rose-500/10 to-pink-600/20 border-rose-200/30 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-rose-500/20 dark:to-rose-600/30 dark:border-rose-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-rose-800 dark:text-rose-200">Metas Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-rose-900 dark:text-rose-100">{activeGoals.length}</div>
                  <p className="text-xs text-rose-700 dark:text-rose-300">Metas em andamento</p>
                </CardContent>
              </Card>
            </div>

            {/* Progresso das Metas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg dark:bg-background/80 dark:border-border dark:shadow-none">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-foreground">Progresso das Metas</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-muted-foreground">
                    {completedGoals.length} de {goals.length} concluídas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={goalCompletionRate} className="h-4 mb-4 bg-slate-100 dark:bg-muted" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-muted-foreground">Taxa de conclusão</span>
                    <span className="font-semibold text-slate-800 dark:text-foreground">{goalCompletionRate.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Top Cadernos */}
              <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg dark:bg-background/80 dark:border-border dark:shadow-none">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-foreground">Top Cadernos</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-muted-foreground">
                    Seu desempenho por matéria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cadernoPerformance.slice(0, 3).map((caderno, index) => (
                      <div key={caderno.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200/50 dark:bg-muted/30 dark:border-border">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-gradient-to-r from-amber-400 to-yellow-500' :
                            index === 1 ? 'bg-gradient-to-r from-slate-400 to-gray-500' :
                            'bg-gradient-to-r from-amber-600 to-orange-600'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-foreground">{caderno.nome || 'Caderno sem nome'}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-slate-800 dark:text-foreground">
                            {caderno.accuracy.toFixed(1)}%
                          </div>
                          <div className="text-xs text-slate-600 dark:text-muted-foreground">
                            {caderno.quizzes} quizzes
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Performance */}
          <TabsContent value="performance" className="space-y-8">
            {/* Gráfico de Evolução */}
            <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg dark:bg-background/80 dark:border-border dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-foreground">Evolução da Performance</CardTitle>
                <CardDescription className="text-slate-600 dark:text-muted-foreground">
                  Gráfico de progresso ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200/50 dark:bg-muted/30 dark:border-border">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4 dark:text-muted-foreground" />
                    <p className="text-slate-600 dark:text-muted-foreground">Gráfico em desenvolvimento</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg dark:bg-background/80 dark:border-border dark:shadow-none">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-foreground">Distribuição de Respostas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-100 rounded-xl border border-emerald-200/50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800 dark:text-foreground">Corretas</span>
                    </div>
                    <span className="font-semibold text-emerald-800 dark:text-foreground">{correctAnswers}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-rose-100 rounded-xl border border-red-200/50">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-800 dark:text-foreground">Incorretas</span>
                    </div>
                    <span className="font-semibold text-red-800 dark:text-foreground">{wrongAnswers}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-100 rounded-xl border border-amber-200/50">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800 dark:text-foreground">Pendentes</span>
                    </div>
                    <span className="font-semibold text-amber-800 dark:text-foreground">
                      {totalQuestions - correctAnswers - wrongAnswers}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg dark:bg-background/80 dark:border-border dark:shadow-none">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-foreground">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentQuizzes.slice(0, 3).map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200/50 dark:bg-muted/30 dark:border-border">
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-foreground">{quiz.quiz?.title || 'Quiz sem nome'}</p>
                          <p className="text-xs text-slate-600 dark:text-muted-foreground">
                            {new Date(quiz.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-white/80 border-slate-200 text-slate-700 dark:bg-background/80 dark:border-border dark:text-foreground">
                          {quiz.correct_answers || 0}/{quiz.total_questions || 0}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Metas */}
          <TabsContent value="goals" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg dark:bg-background/80 dark:border-border dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-foreground">Status das Metas</CardTitle>
                <CardDescription className="text-slate-600 dark:text-muted-foreground">
                  Acompanhe todas as suas metas e desafios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.length > 0 ? (
                    goals.map((goal) => (
                      <div key={goal.id} className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200/50 rounded-2xl dark:bg-muted/30 dark:border-border">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Target className="w-6 h-6 text-purple-600" />
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-foreground">{goal.title || 'Sem título'}</h4>
                              <p className="text-sm text-slate-600 dark:text-muted-foreground">{goal.description || 'Sem descrição'}</p>
                            </div>
                          </div>
                          <Badge variant={goal.completed ? 'default' : 'outline'} className={goal.completed ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' : 'bg-white/80 border-slate-200 text-slate-700 dark:bg-background/80 dark:border-border dark:text-foreground'}>
                            {goal.completed ? 'Concluída' : 'Ativa'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-muted-foreground">Progresso</span>
                            <span className="font-semibold text-slate-800 dark:text-foreground">
                              {goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0}%
                            </span>
                          </div>
                          <Progress 
                            value={goal.target > 0 ? (goal.current / goal.target) * 100 : 0} 
                            className="h-3 bg-slate-100 dark:bg-muted" 
                          />
                          
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-muted-foreground">
                            <span>Tipo: {goal.type || 'N/A'}</span>
                            <span>Prazo: {new Date(goal.deadline || new Date()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-20 h-20 text-slate-300 mx-auto mb-6 dark:text-muted-foreground" />
                      <p className="text-slate-600 dark:text-muted-foreground text-lg mb-2">Nenhuma meta criada ainda</p>
                      <p className="text-sm text-slate-500 dark:text-muted-foreground">Crie suas primeiras metas para começar!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Insights */}
          <TabsContent value="insights" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg dark:bg-background/80 dark:border-border dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-foreground">Recomendações Inteligentes</CardTitle>
                <CardDescription className="text-slate-600 dark:text-muted-foreground">
                  Sugestões baseadas no seu histórico de estudos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accuracy < 70 && (
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200/50 rounded-2xl">
                      <HelpCircle className="w-6 h-6 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-amber-800 dark:text-foreground">Foque na Revisão</h4>
                        <p className="text-sm text-amber-700 dark:text-muted-foreground">
                          Sua precisão está abaixo de 70%. Considere revisar os cadernos com menor desempenho.
                        </p>
                      </div>
                    </div>
                  )}

                  {studyDays < 7 && (
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200/50 rounded-2xl">
                      <Calendar className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-foreground">Estabeleça uma Rotina</h4>
                        <p className="text-sm text-blue-700 dark:text-muted-foreground">
                          Você estudou em apenas {studyDays} dias. Tente manter uma frequência mais consistente.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeGoals.length === 0 && (
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-100 border border-purple-200/50 rounded-2xl">
                      <Target className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-purple-800 dark:text-foreground">Defina Metas</h4>
                        <p className="text-sm text-purple-700 dark:text-muted-foreground">
                          Você não tem metas ativas. Crie algumas para manter o foco e motivação.
                        </p>
                      </div>
                    </div>
                  )}

                  {cadernoPerformance.length > 0 && cadernoPerformance[0].accuracy > 80 && (
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-100 border border-emerald-200/50 rounded-2xl">
                      <Star className="w-6 h-6 text-emerald-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-emerald-800 dark:text-foreground">Excelente Desempenho!</h4>
                        <p className="text-sm text-emerald-700 dark:text-muted-foreground">
                          Você está se saindo muito bem em {cadernoPerformance[0].nome}! Continue assim!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Padrões de Estudo */}
            <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg dark:bg-background/80 dark:border-border dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-foreground">Padrões de Estudo</CardTitle>
                <CardDescription className="text-slate-600 dark:text-muted-foreground">
                  Análise dos seus hábitos de estudo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200/50 dark:bg-muted/30 dark:border-border">
                    <div className="text-3xl font-bold text-blue-800 dark:text-foreground">{averageQuizzesPerDay.toFixed(1)}</div>
                    <div className="text-sm text-blue-700 dark:text-muted-foreground">Quizzes por dia</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl border border-emerald-200/50 dark:bg-muted/30 dark:border-border">
                    <div className="text-3xl font-bold text-emerald-800 dark:text-foreground">{studyDays}</div>
                    <div className="text-sm text-emerald-700 dark:text-muted-foreground">Dias ativos</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl border border-purple-200/50 dark:bg-muted/30 dark:border-border">
                    <div className="text-3xl font-bold text-purple-800 dark:text-foreground">{totalQuestions}</div>
                    <div className="text-sm text-purple-700 dark:text-muted-foreground">Questões respondidas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conquistas */}
            <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg dark:bg-background/80 dark:border-border dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-foreground">Conquistas</CardTitle>
                <CardDescription className="text-slate-600 dark:text-muted-foreground">
                  Suas realizações e marcos importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {totalQuizzes >= 10 && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200/50 rounded-2xl">
                      <Award className="w-10 h-10 text-amber-600" />
                      <div>
                        <h4 className="font-semibold text-amber-800 dark:text-foreground">Dedicação</h4>
                        <p className="text-sm text-amber-700 dark:text-muted-foreground">Completou 10+ quizzes</p>
                      </div>
                    </div>
                  )}
                  
                  {accuracy >= 80 && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-100 border border-emerald-200/50 rounded-2xl">
                      <Star className="w-10 h-10 text-emerald-600" />
                      <div>
                        <h4 className="font-semibold text-emerald-800 dark:text-foreground">Precisão</h4>
                        <p className="text-sm text-emerald-700 dark:text-muted-foreground">Manteve 80%+ de acerto</p>
                      </div>
                    </div>
                  )}
                  
                  {studyDays >= 7 && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200/50 rounded-2xl">
                      <Calendar className="w-10 h-10 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-foreground">Consistência</h4>
                        <p className="text-sm text-blue-700 dark:text-muted-foreground">Estudou por 7+ dias</p>
                      </div>
                    </div>
                  )}
                  
                  {activeGoals.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-100 border border-purple-200/50 rounded-2xl">
                      <Target className="w-10 h-10 text-purple-600" />
                      <div>
                        <h4 className="font-semibold text-purple-800 dark:text-foreground">Foco</h4>
                        <p className="text-sm text-purple-700 dark:text-muted-foreground">Definiu metas de estudo</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
