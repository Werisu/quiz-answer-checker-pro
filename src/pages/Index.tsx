
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useQuiz } from '@/hooks/useQuiz';
import { Header } from '@/components/Header';
import { QuestionTracker } from '@/components/QuestionTracker';
import { Results } from '@/components/Results';
import { AuthModal } from '@/components/AuthModal';
import { QuizHistory } from '@/components/QuizHistory';
import { AdminPanel } from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { LogOut, User, History, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MainContent = () => {
  const [showResults, setShowResults] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { user, signOut, loading: authLoading, userProfile } = useAuth();
  const {
    currentQuiz,
    loading: quizLoading,
    createQuiz,
    updateAnswer,
    saveResults,
    resetQuiz,
    getResults,
  } = useQuiz();

  const handleInitialize = async (count: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    await createQuiz(`Gabarito ${new Date().toLocaleString()}`, count);
  };

  const handleShowResults = async () => {
    if (currentQuiz) {
      await saveResults();
    }
    setShowResults(true);
  };

  const handleReset = () => {
    resetQuiz();
    setShowResults(false);
  };

  const handleUpdateStatus = (questionId: number, status: 'correct' | 'incorrect' | 'unanswered') => {
    if (!currentQuiz) return;
    const question = currentQuiz.questions.find(q => q.question_number === questionId);
    if (question) {
      updateAnswer(question.id, status);
    }
  };

  const results = getResults();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return <QuizHistory onBack={() => setShowHistory(false)} />;
  }

  if (showAdminPanel) {
    return <AdminPanel onBack={() => setShowAdminPanel(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* User Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                  {userProfile?.role === 'admin' && (
                    <Badge variant="destructive" className="bg-red-100 text-red-800 text-xs">
                      ADMIN
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowHistory(true)}
                    className="bg-white/80"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Histórico
                  </Button>
                  {userProfile?.role === 'admin' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAdminPanel(true)}
                      className="bg-white/80"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={signOut}
                    className="bg-white/80"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
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
          onShowResults={handleShowResults}
          hasQuestions={!!currentQuiz}
          results={results}
        />

        {showResults && currentQuiz ? (
          <Results
            results={results}
            onBack={() => setShowResults(false)}
          />
        ) : currentQuiz ? (
          <QuestionTracker
            questions={currentQuiz.questions.map(q => ({
              id: q.question_number,
              status: q.status,
            }))}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Bem-vindo ao Gabarito Digital
              </h2>
              <p className="text-gray-600 mb-6">
                {user 
                  ? "Digite o número de questões para começar a marcar suas respostas."
                  : "Faça login para começar a usar o gabarito e salvar seus resultados."
                }
              </p>
              {!user && (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
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
