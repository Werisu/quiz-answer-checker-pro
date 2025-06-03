
import React from 'react';
import { Card } from '@/components/ui/card';
import { QuestionCard } from '@/components/QuestionCard';
import { Question } from '@/pages/Index';

interface QuestionTrackerProps {
  questions: Question[];
  onUpdateStatus: (questionId: number, status: 'correct' | 'incorrect' | 'unanswered') => void;
}

export const QuestionTracker: React.FC<QuestionTrackerProps> = ({
  questions,
  onUpdateStatus
}) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Questões ({questions.length})
        </h2>
        <p className="text-gray-600 text-sm">
          Clique nos botões para marcar cada questão como certa (✓) ou errada (✗)
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </Card>
  );
};
