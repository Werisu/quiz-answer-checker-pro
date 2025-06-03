
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { RotateCcw, Play, BarChart3 } from 'lucide-react';

interface HeaderProps {
  onInitialize: (count: number) => void;
  onReset: () => void;
  onShowResults: () => void;
  hasQuestions: boolean;
  results: {
    correct: number;
    incorrect: number;
    unanswered: number;
    total: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  onInitialize,
  onReset,
  onShowResults,
  hasQuestions,
  results
}) => {
  const [questionCount, setQuestionCount] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionCount > 0 && questionCount <= 200) {
      onInitialize(questionCount);
    }
  };

  const percentage = results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0;

  return (
    <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Gabarito Digital
          </h1>
          <p className="text-gray-600 text-sm">
            Marque suas respostas conforme confere o PDF
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {!hasQuestions && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="200"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                placeholder="Nº questões"
                className="w-24"
              />
              <Button type="submit" className="whitespace-nowrap">
                <Play className="w-4 h-4 mr-2" />
                Iniciar
              </Button>
            </form>
          )}
          
          {hasQuestions && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">{results.correct}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">{results.incorrect}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span className="text-gray-600">{results.unanswered}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 ml-2">
                  {percentage}%
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={onShowResults}
                  size="sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Resultados
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onReset}
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reiniciar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
