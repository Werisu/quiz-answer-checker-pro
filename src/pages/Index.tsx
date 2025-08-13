import { AdminPanel } from '@/components/AdminPanel';
import { AdvancedStats } from '@/components/AdvancedStats';
import { AuthModal } from '@/components/AuthModal';
import { Dashboard } from '@/components/Dashboard';
import { GoalsAndChallenges } from '@/components/GoalsAndChallenges';
import { Header } from '@/components/Header';
import { QuestionTracker } from '@/components/QuestionTracker';
import { QuizHistory } from '@/components/QuizHistory';
import { Results } from '@/components/Results';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useCadernos } from '@/hooks/useCadernos';
import { useQuiz } from '@/hooks/useQuiz';
import { Activity, BarChart3, History, LogOut, Settings, Target, User } from 'lucide-react';
import { useState } from 'react';

const MainContent = () => {
  const [showResults, setShowResults] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [showGoalsAndChallenges, setShowGoalsAndChallenges] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { user, signOut, loading: authLoading, userProfile } = useAuth();
  const { cadernos, createCaderno } = useCadernos();
  const {
    currentQuiz,
    loading: quizLoading,
    createQuiz,
    updateAnswer,
    saveResults,
    resetQuiz,
    getResults,
  } = useQuiz();

  const handleInitialize = async (count: number, pdfName: string, description: string, cadernoId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    await createQuiz(`Gabarito ${new Date().toLocaleString()}`, count, pdfName, description, cadernoId);
  };

  const handleCadernoCreate = async (nome: string, descricao: string) => {
    try {
      console.log('🔍 [Index] Iniciando criação de caderno:', { nome, descricao });
      await createCaderno(nome, descricao);
      console.log('✅ [Index] Caderno criado com sucesso');
    } catch (error) {
      console.error('❌ [Index] Erro ao criar caderno:', error);
    }
  };

  const handleSave = async () => {
    if (currentQuiz) {
      await saveResults();
      setShowResults(true);
    }
  };

  const handleReset = () => {
    resetQuiz();
    setShowResults(false);
  };

  const handleUpdateStatus = (questionId: number, status: 'correct' | 'incorrect' | 'unanswered', legend?: 'circle' | 'star' | 'question' | 'exclamation' | null) => {
    if (!currentQuiz) return;
    const question = currentQuiz.questions.find(q => q.question_number === questionId);
    if (question) {
      updateAnswer(question.id, status, legend);
    }
  };

  const results = getResults();

  if (authLoading) {
    return (
             <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80 flex items-center justify-center">
        <div className="text-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return <QuizHistory onBack={() => setShowHistory(false)} />;
  }

  if (showAdvancedStats) {
    return <AdvancedStats onBack={() => setShowAdvancedStats(false)} />;
  }

  if (showGoalsAndChallenges) {
    return (
      <GoalsAndChallenges onBack={() => setShowGoalsAndChallenges(false)} />
    );
  }

  if (showAdminPanel) {
    return <AdminPanel onBack={() => setShowAdminPanel(false)} />;
  }

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* User Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            {user ? (
              <>
                              <div className="flex items-center gap-2 bg-background/80 px-3 py-2 rounded-lg w-full sm:w-auto">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground truncate">{user.email}</span>
                  {userProfile?.role === 'admin' && (
                    <Badge variant="destructive" className="bg-destructive/20 text-destructive text-xs">
                      ADMIN
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDashboard(true)}
                    className="bg-background/80 w-full"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowHistory(true)}
                    className="bg-background/80 w-full"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Histórico
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAdvancedStats(true)}
                    className="bg-background/80 w-full"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Estatísticas
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowGoalsAndChallenges(true)}
                    className="bg-background/80 w-full"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Metas
                  </Button>
                  {userProfile?.role === 'admin' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAdminPanel(true)}
                      className="bg-background/80 w-full"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={signOut}
                    className="bg-background/80 w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                <User className="w-4 h-4 mr-2" />
                Entrar / Cadastrar
              </Button>
            )}
          </div>
        </div>

        <Header
          onInitialize={handleInitialize}
          onReset={handleReset}
          onSave={handleSave}
          hasQuestions={!!currentQuiz}
          results={results}
          cadernos={cadernos}
          onCadernoCreate={handleCadernoCreate}
        />

        {showResults && currentQuiz ? (
          <Results
            results={results}
            onBack={() => setShowResults(false)}
          />
        ) : currentQuiz ? (
          <div className="mt-6">
            <QuestionTracker
              questions={currentQuiz.questions.map(q => ({
                id: q.question_number,
                status: q.status,
                legend: q.legend
              }))}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 sm:p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Bem-vindo ao Gabarito Digital
              </h2>
              <p className="text-muted-foreground mb-6">
                {user 
                  ? "Digite o número de questões para começar a marcar suas respostas."
                  : "Faça login para começar a usar o gabarito e salvar seus resultados."
                }
              </p>
              {!user && (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                >
                  Entrar / Cadastrar
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default Index;
