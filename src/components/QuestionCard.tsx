
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, RotateCcw } from 'lucide-react';
import { Question } from '@/pages/Index';

interface QuestionCardProps {
  question: Question;
  onUpdateStatus: (questionId: number, status: 'correct' | 'incorrect' | 'unanswered') => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onUpdateStatus
}) => {
  const getCardStyle = () => {
    switch (question.status) {
      case 'correct':
        return 'border-green-500 bg-green-50';
      case 'incorrect':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-200 bg-white hover:border-gray-300';
    }
  };

  const getStatusIcon = () => {
    switch (question.status) {
      case 'correct':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'incorrect':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <span className="text-gray-400 text-lg">?</span>;
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 ${getCardStyle()}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gray-800">
          Questão {question.id}
        </span>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200">
          {getStatusIcon()}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={question.status === 'correct' ? 'default' : 'outline'}
          className={`flex-1 ${
            question.status === 'correct' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'border-green-500 text-green-600 hover:bg-green-50'
          }`}
          onClick={() => onUpdateStatus(question.id, 'correct')}
        >
          <Check className="w-4 h-4 mr-1" />
          Certa
        </Button>
        
        <Button
          size="sm"
          variant={question.status === 'incorrect' ? 'default' : 'outline'}
          className={`flex-1 ${
            question.status === 'incorrect' 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'border-red-500 text-red-600 hover:bg-red-50'
          }`}
          onClick={() => onUpdateStatus(question.id, 'incorrect')}
        >
          <X className="w-4 h-4 mr-1" />
          Errada
        </Button>
        
        {question.status !== 'unanswered' && (
          <Button
            size="sm"
            variant="ghost"
            className="px-2"
            onClick={() => onUpdateStatus(question.id, 'unanswered')}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};
