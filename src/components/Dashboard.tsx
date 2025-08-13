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
  BookOpen,
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
import React, { useEffect, useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80">
      {/* Header */}
      <div className="bg-background/80 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard Personalizado</h1>
              <p className="text-muted-foreground">Acompanhe seu progresso e desempenho</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-accent/50">
              <Award className="w-4 h-4 mr-1" />
              Nível 1
            </Badge>
            <Badge variant="outline" className="bg-accent/50">
              <Star className="w-4 h-4 mr-1" />
              0 pts
            </Badge>
          </div>
        </div>
      </div>

      {/* Botões de Navegação Rápida */}
      {showNavigationButtons && (
        <div className="bg-background/60 border-b border-border p-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {onNavigateToQuizCreator && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onNavigateToQuizCreator}
                  className="bg-background/80"
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
                  className="bg-background/80"
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
                  className="bg-background/80"
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
                  className="bg-background/80"
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
                  className="bg-background/80"
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-background">
              Performance
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-background">
              Metas
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-background">
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Tab: Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* Cards de Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-background/80 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Total de Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{totalQuizzes}</div>
                  <p className="text-xs text-muted-foreground">Quizzes realizados</p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Precisão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{accuracy.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Taxa de acerto</p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Frequência</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{studyDays}</div>
                  <p className="text-xs text-muted-foreground">Dias de estudo</p>
                </CardContent>
              </Card>

              <Card className="bg-background/80 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Metas Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{activeGoals.length}</div>
                  <p className="text-xs text-muted-foreground">Metas em andamento</p>
                </CardContent>
              </Card>
            </div>

            {/* Progresso das Metas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-background/80 border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Progresso das Metas</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {completedGoals.length} de {goals.length} concluídas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={goalCompletionRate} className="h-3 mb-4" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de conclusão</span>
                    <span className="font-medium text-foreground">{goalCompletionRate.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Top Cadernos */}
              <Card className="bg-background/80 border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Top Cadernos</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Seu desempenho por matéria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cadernoPerformance.slice(0, 3).map((caderno) => (
                      <div key={caderno.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-foreground">{caderno.nome || 'Caderno sem nome'}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">
                            {caderno.accuracy.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
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
          <TabsContent value="performance" className="space-y-6">
            {/* Gráfico de Evolução */}
            <Card className="bg-background/80 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Evolução da Performance</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Gráfico de progresso ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Gráfico em desenvolvimento</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-background/80 border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Distribuição de Respostas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-foreground">Corretas</span>
                    </div>
                    <span className="font-medium text-foreground">{correctAnswers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-foreground">Incorretas</span>
                    </div>
                    <span className="font-medium text-foreground">{wrongAnswers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-foreground">Pendentes</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {totalQuestions - correctAnswers - wrongAnswers}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/80 border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentQuizzes.slice(0, 3).map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <p className="text-sm font-medium text-foreground">{quiz.quiz?.title || 'Quiz sem nome'}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(quiz.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
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
            <Card className="bg-background/80 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Status das Metas</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Acompanhe todas as suas metas e desafios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.length > 0 ? (
                    goals.map((goal) => (
                      <div key={goal.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-purple-500" />
                            <div>
                              <h4 className="font-medium text-foreground">{goal.title || 'Sem título'}</h4>
                              <p className="text-sm text-muted-foreground">{goal.description || 'Sem descrição'}</p>
                            </div>
                          </div>
                          <Badge variant={goal.completed ? 'default' : 'outline'}>
                            {goal.completed ? 'Concluída' : 'Ativa'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium text-foreground">
                              {goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0}%
                            </span>
                          </div>
                          <Progress 
                            value={goal.target > 0 ? (goal.current / goal.target) * 100 : 0} 
                            className="h-2" 
                          />
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Tipo: {goal.type || 'N/A'}</span>
                            <span>Prazo: {new Date(goal.deadline || new Date()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhuma meta criada ainda</p>
                      <p className="text-sm text-muted-foreground">Crie suas primeiras metas para começar!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Insights */}
          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-background/80 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recomendações Inteligentes</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sugestões baseadas no seu histórico de estudos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accuracy < 70 && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <HelpCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Foque na Revisão</h4>
                        <p className="text-sm text-muted-foreground">
                          Sua precisão está abaixo de 70%. Considere revisar os cadernos com menor desempenho.
                        </p>
                      </div>
                    </div>
                  )}

                  {studyDays < 7 && (
                    <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Estabeleça uma Rotina</h4>
                        <p className="text-sm text-muted-foreground">
                          Você estudou em apenas {studyDays} dias. Tente manter uma frequência mais consistente.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeGoals.length === 0 && (
                    <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <Target className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Defina Metas</h4>
                        <p className="text-sm text-muted-foreground">
                          Você não tem metas ativas. Crie algumas para manter o foco e motivação.
                        </p>
                      </div>
                    </div>
                  )}

                  {cadernoPerformance.length > 0 && cadernoPerformance[0].accuracy > 80 && (
                    <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <Star className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">Excelente Desempenho!</h4>
                        <p className="text-sm text-muted-foreground">
                          Você está se saindo muito bem em {cadernoPerformance[0].nome}! Continue assim!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Padrões de Estudo */}
            <Card className="bg-background/80 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Padrões de Estudo</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Análise dos seus hábitos de estudo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{averageQuizzesPerDay.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Quizzes por dia</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{studyDays}</div>
                    <div className="text-sm text-muted-foreground">Dias ativos</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{totalQuestions}</div>
                    <div className="text-sm text-muted-foreground">Questões respondidas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conquistas */}
            <Card className="bg-background/80 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Conquistas</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Suas realizações e marcos importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {totalQuizzes >= 10 && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <Award className="w-8 h-8 text-yellow-500" />
                      <div>
                        <h4 className="font-medium text-foreground">Dedicação</h4>
                        <p className="text-sm text-muted-foreground">Completou 10+ quizzes</p>
                      </div>
                    </div>
                  )}
                  
                  {accuracy >= 80 && (
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <Star className="w-8 h-8 text-green-500" />
                      <div>
                        <h4 className="font-medium text-foreground">Precisão</h4>
                        <p className="text-sm text-muted-foreground">Manteve 80%+ de acerto</p>
                      </div>
                    </div>
                  )}
                  
                  {studyDays >= 7 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <Calendar className="w-8 h-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium text-foreground">Consistência</h4>
                        <p className="text-sm text-muted-foreground">Estudou por 7+ dias</p>
                      </div>
                    </div>
                  )}
                  
                  {activeGoals.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <Target className="w-8 h-8 text-purple-500" />
                      <div>
                        <h4 className="font-medium text-foreground">Foco</h4>
                        <p className="text-sm text-muted-foreground">Definiu metas de estudo</p>
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
