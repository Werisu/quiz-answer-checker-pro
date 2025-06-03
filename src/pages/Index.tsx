
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { QuestionTracker } from '@/components/QuestionTracker';
import { Results } from '@/components/Results';

export interface Question {
  id: number;
  status: 'unanswered' | 'correct' | 'incorrect';
}

const Index = () => {
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showResults, setShowResults] = useState(false);

  const initializeQuestions = (count: number) => {
    const newQuestions: Question[] = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      status: 'unanswered'
    }));
    setQuestions(newQuestions);
    setTotalQuestions(count);
    setShowResults(false);
  };

  const updateQuestionStatus = (questionId: number, status: 'correct' | 'incorrect' | 'unanswered') => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId ? { ...q, status } : q
      )
    );
  };

  const resetQuestions = () => {
    setQuestions([]);
    setShowResults(false);
  };

  const calculateResults = () => {
    const correct = questions.filter(q => q.status === 'correct').length;
    const incorrect = questions.filter(q => q.status === 'incorrect').length;
    const unanswered = questions.filter(q => q.status === 'unanswered').length;
    
    return { correct, incorrect, unanswered, total: questions.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Header 
          onInitialize={initializeQuestions}
          onReset={resetQuestions}
          onShowResults={() => setShowResults(true)}
          hasQuestions={questions.length > 0}
          results={calculateResults()}
        />
        
        {questions.length > 0 && !showResults && (
          <QuestionTracker 
            questions={questions}
            onUpdateStatus={updateQuestionStatus}
          />
        )}
        
        {showResults && questions.length > 0 && (
          <Results 
            results={calculateResults()}
            onBack={() => setShowResults(false)}
          />
        )}
        
        {questions.length === 0 && !showResults && (
          <div className="text-center mt-16">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Sistema de Gabarito
              </h2>
              <p className="text-gray-600 mb-6">
                Configure a quantidade de questões para começar a marcar suas respostas
              </p>
              <div className="text-sm text-gray-500">
                ✓ Marque questões como certas ou erradas<br/>
                ✓ Acompanhe seu progresso em tempo real<br/>
                ✓ Visualize seus resultados detalhados
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
