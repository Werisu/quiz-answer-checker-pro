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
import { LogOut, Plus, User } from 'lucide-react';
import { useState } from 'react';

const MainContent = () => {
  const [showResults, setShowResults] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [showGoalsAndChallenges, setShowGoalsAndChallenges] = useState(false);
  const [showQuizCreator, setShowQuizCreator] = useState(false);
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
    setShowQuizCreator(false);
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

  // Se não estiver logado, mostrar tela de login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Bem-vindo ao Gabarito Digital
            </h2>
            <p className="text-muted-foreground mb-6">
              Faça login para começar a usar o gabarito e acompanhar seu progresso.
            </p>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="bg-primary hover:bg-primary/90 w-full"
            >
              <User className="w-4 h-4 mr-2" />
              Entrar / Cadastrar
            </Button>
          </div>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  // Se estiver criando um quiz, mostrar o criador
  if (showQuizCreator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header com botão voltar */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowQuizCreator(false)}
              className="bg-background/80"
            >
              ← Voltar ao Dashboard
            </Button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-foreground">Criar Novo Quiz</h1>
              <p className="text-muted-foreground">Configure e inicie um novo gabarito</p>
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
            <div className="text-center py-8">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Criar Novo Quiz
                </h2>
                <p className="text-muted-foreground mb-6">
                  Digite o número de questões para começar a marcar suas respostas.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Se estiver mostrando resultados, mostrar tela de resultados
  if (showResults && currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowResults(false)}
              className="bg-background/80"
            >
              ← Voltar ao Quiz
            </Button>
          </div>
          <Results
            results={results}
            onBack={() => setShowResults(false)}
          />
        </div>
      </div>
    );
  }

  // Se estiver fazendo um quiz, mostrar o quiz
  if (currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header com botão voltar */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => resetQuiz()}
              className="bg-background/80"
            >
              ← Voltar ao Dashboard
            </Button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-foreground">Quiz em Andamento</h1>
              <p className="text-muted-foreground">Marque suas respostas e salve os resultados</p>
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
        </div>
      </div>
    );
  }

  // Se estiver mostrando outras telas, mostrar com botão voltar
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

  // Dashboard como tela principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80">
      {/* Header com informações do usuário e navegação */}
      <div className="bg-background/80 border-b border-border p-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-background/80 px-3 py-2 rounded-lg w-full sm:w-auto">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground truncate">{user.email}</span>
                {userProfile?.role === 'admin' && (
                  <Badge variant="destructive" className="bg-destructive/20 text-destructive text-xs">
                    ADMIN
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowQuizCreator(true)}
                className="bg-background/80"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Quiz
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="bg-background/80"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard com navegação para outras funcionalidades */}
      <Dashboard 
        onBack={() => {}} // Não precisa de onBack no Dashboard principal
        onNavigateToHistory={() => setShowHistory(true)}
        onNavigateToStats={() => setShowAdvancedStats(true)}
        onNavigateToGoals={() => setShowGoalsAndChallenges(true)}
        onNavigateToAdmin={() => setShowAdminPanel(true)}
        onNavigateToQuizCreator={() => setShowQuizCreator(true)}
        showNavigationButtons={true}
      />

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
