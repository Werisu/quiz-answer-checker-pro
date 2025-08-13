import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Question } from '@/hooks/useQuiz';
import { AlertCircle, Check, Circle, HelpCircle, Minus, Star, X } from 'lucide-react';
import React from 'react';

interface QuestionCardProps {
  question: Question;
  onUpdateStatus: (questionId: number, status: 'correct' | 'incorrect' | 'unanswered', legend?: 'circle' | 'star' | 'question' | 'exclamation' | null) => void;
  isEditing?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onUpdateStatus, isEditing = false }) => {
  
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

  const getLegendIcon = (legend: string | null | undefined) => {
    switch (legend) {
      case 'circle': return <Circle className="w-4 h-4" />;
      case 'star': return <Star className="w-4 h-4" />;
      case 'question': return <HelpCircle className="w-4 h-4" />;
      case 'exclamation': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getLegendColor = (legend: string | null | undefined) => {
    switch (legend) {
      case 'circle': return 'bg-blue-500 hover:bg-blue-600';
      case 'star': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'question': return 'bg-purple-500 hover:bg-purple-600';
      case 'exclamation': return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-gray-200 hover:bg-gray-300';
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
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              className={`flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-full ${
                question.status === 'correct' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-200 hover:bg-green-100'
              }`}
              onClick={() => onUpdateStatus(question.question_number, 'correct', question.legend)}
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
              onClick={() => onUpdateStatus(question.question_number, 'incorrect', question.legend)}
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
              onClick={() => onUpdateStatus(question.question_number, 'unanswered', question.legend)}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className={`flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-full ${getLegendColor(question.legend === 'circle' ? 'circle' : null)}`}
              onClick={() => onUpdateStatus(question.question_number, question.status, 'circle')}
            >
              <Circle className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              className={`flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-full ${getLegendColor(question.legend === 'star' ? 'star' : null)}`}
              onClick={() => onUpdateStatus(question.question_number, question.status, 'star')}
            >
              <Star className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              className={`flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-full ${getLegendColor(question.legend === 'question' ? 'question' : null)}`}
              onClick={() => onUpdateStatus(question.question_number, question.status, 'question')}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              className={`flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-full ${getLegendColor(question.legend === 'exclamation' ? 'exclamation' : null)}`}
              onClick={() => onUpdateStatus(question.question_number, question.status, 'exclamation')}
            >
              <AlertCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
