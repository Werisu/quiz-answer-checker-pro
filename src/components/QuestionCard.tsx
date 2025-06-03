import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Question } from '@/hooks/useQuiz';
import { Check, Minus, X } from 'lucide-react';
import React from 'react';

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-800 min-w-[2rem]">
            {question.question_number}
          </span>
          {question.text && (
            <span className="text-sm text-gray-600 line-clamp-2">
              {question.text}
            </span>
          )}
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            className={`flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-full ${
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
            className={`flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-full ${
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
            className={`flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-full ${
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
