import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Play, RotateCcw, Save } from 'lucide-react';
import React, { useState } from 'react';

interface HeaderProps {
  onInitialize: (count: number, pdfName: string, description: string) => void;
  onReset: () => void;
  onSave: () => void;
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
  onSave,
  hasQuestions,
  results,
}) => {
  const [questionCount, setQuestionCount] = useState(10);
  const [pdfName, setPdfName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInitialize(questionCount, pdfName, description);
  };

  const percentage = results.total > 0
    ? ((results.correct + results.incorrect) / results.total) * 100
    : 0;

  const allQuestionsAnswered = results.unanswered === 0 && results.total > 0;

  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex flex-col gap-6 w-full">
        {!hasQuestions && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                min="1"
                max="200"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                placeholder="Nº questões"
                className="w-full"
              />
              <Input
                type="text"
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value)}
                placeholder="Nome do PDF"
                className="w-full"
              />
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              className="w-full"
            />
            <Button type="submit" className="w-full sm:w-auto">
              <Play className="w-4 h-4 mr-2" />
              Iniciar
            </Button>
          </form>
        )}
        
        {hasQuestions && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full">
            <div className="flex flex-wrap items-center gap-4 text-sm">
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
              <span className="text-sm font-medium text-gray-700">
                {percentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {allQuestionsAnswered && (
                <Button onClick={onSave} className="w-full bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              )}
              <Button variant="outline" onClick={onReset} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
