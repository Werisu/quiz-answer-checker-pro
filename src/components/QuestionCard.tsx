
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Minus } from 'lucide-react';
import { Question } from '@/hooks/useQuiz';

interface QuestionCardProps {
  question: Question;
  onUpdateStatus: (questionId: number, status: 'correct' | 'incorrect' | 'unanswered') => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onUpdateStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'bg-green-500 hover:bg-green-600';
      case 'incorrect': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-300 hover:bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct': return <Check className="w-4 h-4" />;
      case 'incorrect': return <X className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm border-0 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-800">
          {question.question_number}
        </span>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            className={`w-10 h-10 rounded-full ${
              question.status === 'correct' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-200 hover:bg-green-100'
            }`}
            onClick={() => onUpdateStatus(question.question_number, 'correct')}
          >
            <Check className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            className={`w-10 h-10 rounded-full ${
              question.status === 'incorrect' 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-200 hover:bg-red-100'
            }`}
            onClick={() => onUpdateStatus(question.question_number, 'incorrect')}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            className={`w-10 h-10 rounded-full ${
              question.status === 'unanswered' 
                ? 'bg-gray-400 hover:bg-gray-500' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => onUpdateStatus(question.question_number, 'unanswered')}
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
