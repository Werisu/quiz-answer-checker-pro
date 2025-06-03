
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Target, AlertCircle } from 'lucide-react';

interface ResultsProps {
  results: {
    correct: number;
    incorrect: number;
    unanswered: number;
    total: number;
  };
  onBack: () => void;
}

export const Results: React.FC<ResultsProps> = ({ results, onBack }) => {
  const percentage = Math.round((results.correct / results.total) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Excelente! 🎉", color: "text-green-600", icon: Trophy };
    if (percentage >= 70) return { message: "Bom trabalho! 👍", color: "text-blue-600", icon: Target };
    if (percentage >= 50) return { message: "Continue estudando! 📚", color: "text-yellow-600", icon: AlertCircle };
    return { message: "Precisa revisar! 💪", color: "text-red-600", icon: AlertCircle };
  };

  const performance = getPerformanceMessage();
  const Icon = performance.icon;

  return (
    <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">Resultados</h2>
        <div></div>
      </div>

      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">{percentage}%</span>
        </div>
        <div className={`flex items-center justify-center gap-2 mb-2 ${performance.color}`}>
          <Icon className="w-6 h-6" />
          <h3 className="text-xl font-semibold">{performance.message}</h3>
        </div>
        <p className="text-gray-600">
          Você acertou {results.correct} de {results.total} questões
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Aproveitamento</span>
            <span className="text-sm font-bold text-gray-800">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2"></div>
            <div className="text-2xl font-bold text-green-700">{results.correct}</div>
            <div className="text-sm text-green-600">Acertos</div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-2"></div>
            <div className="text-2xl font-bold text-red-700">{results.incorrect}</div>
            <div className="text-sm text-red-600">Erros</div>
          </div>
          
          {results.unanswered > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="w-3 h-3 rounded-full bg-gray-400 mx-auto mb-2"></div>
              <div className="text-2xl font-bold text-gray-700">{results.unanswered}</div>
              <div className="text-sm text-gray-600">Não respondidas</div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <Button onClick={onBack} className="px-8">
          Voltar ao Gabarito
        </Button>
      </div>
    </Card>
  );
};
