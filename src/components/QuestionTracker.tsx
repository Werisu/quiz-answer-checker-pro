import React from 'react';
import { QuestionCard } from './QuestionCard';

interface QuestionTrackerProps {
  questions: Array<{
    id: number;
    status: 'correct' | 'incorrect' | 'unanswered';
    legend?: 'circle' | 'star' | 'question' | 'exclamation' | null;
  }>;
  onUpdateStatus: (questionId: number, status: 'correct' | 'incorrect' | 'unanswered', legend?: 'circle' | 'star' | 'question' | 'exclamation' | null) => void;
}

export const QuestionTracker: React.FC<QuestionTrackerProps> = ({
  questions,
  onUpdateStatus
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={{
            id: question.id.toString(),
            quiz_id: '',
            question_number: question.id,
            text: null,
            correct_answer: null,
            status: question.status,
            legend: question.legend
          }}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};
