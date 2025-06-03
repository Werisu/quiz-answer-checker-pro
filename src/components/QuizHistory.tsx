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
import { useQuiz } from '@/hooks/useQuiz';
import { Calendar, History, Target, Trash2, TrendingUp } from 'lucide-react';
import React, { useEffect } from 'react';

interface QuizHistoryProps {
  onBack: () => void;
}

export const QuizHistory: React.FC<QuizHistoryProps> = ({ onBack }) => {
  const { quizHistory, fetchQuizHistory, loading, deleteQuizHistory } = useQuiz();

  useEffect(() => {
    fetchQuizHistory();
  }, []);

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
        ) : (
          <div className="space-y-4">
            {quizHistory.map((result) => (
              <Card key={result.id} className="p-4 bg-white/60 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {result.quiz?.title || 'Quiz'}
                    </h3>
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
                      </div>
                      <div className="text-xl font-bold text-gray-800">
                        {result.percentage.toFixed(1)}%
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {getPerformanceBadge(result.percentage)}
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
              </Card>
            ))}
            
            {quizHistory.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Estatísticas Gerais</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total de Quizzes:</span>
                    <div className="font-semibold text-gray-800">{quizHistory.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Média de Acertos:</span>
                    <div className="font-semibold text-green-600">
                      {(quizHistory.reduce((acc, r) => acc + r.percentage, 0) / quizHistory.length).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Melhor Resultado:</span>
                    <div className="font-semibold text-blue-600">
                      {Math.max(...quizHistory.map(r => r.percentage)).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total de Questões:</span>
                    <div className="font-semibold text-gray-800">
                      {quizHistory.reduce((acc, r) => acc + r.total_questions, 0)}
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
